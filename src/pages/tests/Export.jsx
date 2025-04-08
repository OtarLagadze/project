import { collection, getDocs, query } from 'firebase/firestore';
import * as XLSX from "xlsx";
import { db } from '@src/firebaseInit';
import React, { useState } from 'react';

function Export() {
  const [subjectCounts, setSubjectCounts] = useState({});
  const [loading, setLoading] = useState(false);

  async function fetchGrades() {
    setLoading(true);
    try {
      // Fetch all userTestRecords documents (each document's id is the userId)
      const testRecordsSnapshot = await getDocs(query(collection(db, 'userTestRecords')));

      // Fetch all users documents (document ids match userTestRecords ids)
      const usersSnapshot = await getDocs(query(collection(db, 'users')));
      const usersData = {};

      // Build a map of userId -> { username, classId }
      usersSnapshot.docs.forEach(doc => {
        usersData[doc.id] = doc.data();
      });

      // Initialize subject counts
      const subjectCounts = {};

      // Build grades array (keeping userId temporarily for filtering)
      const grades = testRecordsSnapshot.docs.map(doc => {
        const subjects = doc.data();
        const userId = doc.id;
        const userData = usersData[userId] || { username: "Unknown", classId: "N/A" };

        const flattened = {
          userId,
          username: userData.username,
          classId: userData.classId,
        };

        // Add subject data and count occurrences
        Object.entries(subjects).forEach(([subject, details]) => {
          flattened[`${subject}_maxPoint`] = details.maxPoint || 0;
          flattened[`${subject}_usersPoint`] = details.usersPoint || 0;
          subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
        });

        return flattened;
      });

      setSubjectCounts(subjectCounts);
      return grades;
    } catch (error) {
      console.error("Error fetching grades: ", error);
    } finally {
      setLoading(false);
    }
  }

  function exportToExcel(data, filename = "grades.xlsx") {
    // Convert JSON array to worksheet.
    const worksheet = XLSX.utils.json_to_sheet(data);

    // --- Apply cell styling for the "გადავიდა" column ---
    // Determine worksheet range and find the "გადავიდა" header.
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    let passColIndex = -1;
    const headerRow = range.s.r; // Usually row 0

    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = { r: headerRow, c: C };
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      const cell = worksheet[cellRef];
      if (cell && cell.v === "გადავიდა") {
        passColIndex = C;
        break;
      }
    }

    // Apply styling for each cell in the "გადავიდა" column.
    if (passColIndex !== -1) {
      for (let R = headerRow + 1; R <= range.e.r; R++) {
        const cellAddress = { r: R, c: passColIndex };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        const cell = worksheet[cellRef];
        if (cell) {
          if (cell.v === "კი") {
            cell.s = { fill: { fgColor: { rgb: "00FF00" } } };  // Green background.
          } else if (cell.v === "არა") {
            cell.s = { fill: { fgColor: { rgb: "FF0000" } } };  // Red background.
          }
        }
      }
    }
    // -------------------------------

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");
    XLSX.writeFile(workbook, filename);
  }

  const exportData = async () => {
    setLoading(true);
    try {
      const rawData = await fetchGrades();

      // Get unique subjects from keys ending in '_maxPoint'
      const subjects = Array.from(
        new Set(
          rawData.flatMap(item =>
            Object.keys(item).filter(key => key.endsWith('_maxPoint'))
          )
        )
      ).map(key => key.split('_')[0]);

      subjects.forEach(subject => {
        // Filter out unwanted record and only include records having data for this subject.
        const subjectData = rawData
          .filter(item =>
            item.hasOwnProperty(`${subject}_maxPoint`) &&
            item.userId !== "YtrMrMUoHsawT9O7LEIxvr2sUUH3"
          )
          // Sort first by classId (alphabetically) then by the subject's usersPoint (numerically, descending).
          .sort((a, b) => {
            let classCompare = String(a.classId).localeCompare(String(b.classId));
            if (classCompare !== 0) return classCompare;
            return (Number(b[`${subject}_usersPoint`]) || 0) - (Number(a[`${subject}_usersPoint`]) || 0);
          })
          .map(item => ({
            username: item.username,
            classId: item.classId,
            [`${subject}_maxPoint`]: item[`${subject}_maxPoint`] || 0,
            [`${subject}_usersPoint`]: item[`${subject}_usersPoint`] || 0,
          }));

        if (subjectData.length > 0) {
          // Format each record: rename columns and add "გადავიდა" column.
          const formattedData = subjectData.map(item => {
            const usersPoint = Number(item[`${subject}_usersPoint`]) || 0;
            return {
              "სახელი_გვარი": item.username,
              "კლასი": item.classId,
              "მაქს.ქულა": item[`${subject}_maxPoint`],
              "ქულა": item[`${subject}_usersPoint`],
              "გადავიდა": usersPoint >= 10 ? "კი" : "არა"
            };
          });
          
          // Export the formatted data into an Excel file.
          exportToExcel(formattedData, `${subject}_შედეგები.xlsx`);
        }
      });

      console.log("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting data: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={exportData} disabled={loading}>
        {loading ? 'Exporting...' : 'Download'}
      </button>

      {/* Display count of users for each subject */}
      <div>
        {Object.entries(subjectCounts).map(([subject, count]) => (
          <h1 key={subject}>{subject}: {count}</h1>
        ))}
      </div>
    </div>
  );
}

export default Export;
