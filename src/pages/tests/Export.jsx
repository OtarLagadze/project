import { collection, getDocs, query } from 'firebase/firestore';
import * as XLSX from "xlsx";
import { db } from '@src/firebaseInit';
import React, { useState } from 'react';

function Export() {
  const [subjectCounts, setSubjectCounts] = useState({});
  const [loading, setLoading] = useState(false); // To show loading state if needed

  async function fetchGrades() {
    setLoading(true);
    try {
      // Fetch all userTestRecords documents
      const querySnapshot = await getDocs(query(collection(db, 'userTestRecords')));

      // Create a map to hold classId for each user
      const usersClassId = {};

      // Get all user IDs (6-digit IDs) from userTestRecords
      const userIds = querySnapshot.docs.map((doc) => doc.id.slice(-6));

      // Fetch all users in one batch and create a map of userId -> classId
      const usersSnapshot = await getDocs(query(collection(db, 'users')));
      usersSnapshot.docs.forEach(doc => {
        const userId = doc.id; // The userId in the `users` collection is the last six digits
        const classId = doc.data().classId;
        usersClassId[userId] = classId;
      });

      // Initialize subject counts
      const subjectCounts = {};

      // Map and flatten data with the doc ID included
      const grades = querySnapshot.docs.map((doc) => {
        const { id, ...subjects } = doc.data();
        const flattened = {};

        // Split `id` into `username` and `lastSixDigits`
        const docId = doc.id;
        const lastSixDigits = docId.slice(-6);
        const username = docId.slice(0, -6).trim();

        // Include the split values in the flattened object
        flattened.username = username;
        flattened.lastSixDigits = lastSixDigits;

        // Fetch the classId from the usersClassId map using the last six digits as the user ID
        flattened.classId = usersClassId[lastSixDigits] || 'N/A'; // Set 'N/A' if no classId is found

        // Map subject data and count subjects
        Object.entries(subjects).forEach(([subject, details]) => {
          flattened[`${subject}_maxPoint`] = details.maxPoint || 0;
          flattened[`${subject}_usersPoint`] = details.usersPoint || 0;

          // Increment the subject count
          if (!subjectCounts[subject]) {
            subjectCounts[subject] = 0;
          }
          subjectCounts[subject] += 1;
        });

        return flattened;
      });

      // Update the state with subject counts
      setSubjectCounts(subjectCounts);

      return grades;
    } catch (error) {
      console.error("Error fetching grades: ", error);
    } finally {
      setLoading(false);
    }
  }

  function exportToExcel(data, filename = "grades.xlsx") {
    // Modify data for header changes
    const modifiedData = data.map(item => {
      const modifiedItem = { ...item };

      // Rename columns for each subject
      Object.keys(modifiedItem).forEach(key => {
        if (key === "username") {
          modifiedItem["სახელი_გვარი"] = modifiedItem[key];
          delete modifiedItem[key];
        }
        if (key === "lastSixDigits") {
          modifiedItem["კოდი"] = modifiedItem[key];
          delete modifiedItem[key];
        }
        if (key === "classId") {
          modifiedItem["კლასი"] = modifiedItem[key];
          delete modifiedItem[key];
        }
        if (key.endsWith('_maxPoint')) {
          modifiedItem[`მაქს.ქულა`] = modifiedItem[key];
          delete modifiedItem[key];
        }
        if (key.endsWith('_usersPoint')) {
          modifiedItem[`მოსწავლის_ქულა`] = modifiedItem[key];
          delete modifiedItem[key];
        }
      });

      // Add the "დასაწერის_ქულები" column with an empty value
      modifiedItem["დასაწერის_ქულები"] = "";
      modifiedItem["საბოლოო_ქულა"] = "";

      return modifiedItem;
    });

    const worksheet = XLSX.utils.json_to_sheet(modifiedData); // Convert modified data to sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");
    XLSX.writeFile(workbook, filename); // Save file
  }

  const exportData = async () => {
    setLoading(true);
    try {
      const rawData = await fetchGrades();

      // Get all unique subjects from the data
      const subjects = Array.from(
        new Set(rawData.flatMap(item => Object.keys(item).filter(key => key.endsWith('_maxPoint'))))
      ).map(subject => subject.split('_')[0]);

      // For each subject, filter data and export to separate Excel files
      subjects.forEach(subject => {
        // Filter users who have data for this subject
        const subjectData = rawData
          .filter(item => item.hasOwnProperty(`${subject}_maxPoint`))  // Only include users with this subject
          .map(item => {
            const filteredItem = {
              username: item.username,
              lastSixDigits: item.lastSixDigits,
              classId: item.classId, // Add classId to the filtered data
              [`${subject}_maxPoint`]: item[`${subject}_maxPoint`] || 0,
              [`${subject}_usersPoint`]: item[`${subject}_usersPoint`] || 0,
            };
            return filteredItem;
          });

        if (subjectData.length > 0) {
          exportToExcel(subjectData, `${subject}_შედეგები.xlsx`);
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

      {/* Display the count of users for each subject */}
      <div>
        {Object.entries(subjectCounts).map(([subject, count]) => (
          <h1 key={subject}>{subject}: {count}</h1>
        ))}
      </div>
    </div>
  );
}

export default Export;
