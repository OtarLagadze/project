import React from 'react'
import './Problemset.scss'
import { Link } from "react-router-dom"

function Problemset() {
  const data = ["მათემატიკა", "ქართული", "ინგლისური", "ისტორია", "გეოგრაფია", "ფიზიკა", "ქიმია", "ბიოლოგია", "ხელოვნება", "მუსიკა", "მოქალაქეობა", "რუსული"];
  const problems = [
    {
      difficulty: 3,
      id: 1,
      name: "მოდულით შებრუნებული da...",
      subject: "მათემატიკა",
      grade: 12,
      count: 11
    },
    {
      difficulty: 2,
      id: 2,
      name: "dfs",
      grade: 6,
      subject: "ინფორმატიკა",
      count: 121
    },
    {
      difficulty: 1,
      id: 3,
      name: "for loop",
      grade: 5,
      subject: "ინფორმატიკა",
      count: 211
    },
    {
      difficulty: 1,
      id: 4,
      name: "for loop",
      grade: 5,
      subject: "ინფორმატიკა",
      count: 211
    },
    {
      difficulty: 3,
      id: 1,
      name: "მოდულით შებრუნებული da...",
      subject: "მათემატიკა",
      grade: 12,
      count: 11
    },
    {
      difficulty: 2,
      id: 2,
      name: "dfs",
      grade: 6,
      subject: "ინფორმატიკა",
      count: 121
    },
    {
      difficulty: 1,
      id: 3,
      name: "for loop",
      grade: 5,
      subject: "ინფორმატიკა",
      count: 211
    },
    {
      difficulty: 1,
      id: 3,
      name: "for loop",
      grade: 5,
      subject: "ინფორმატიკა",
      count: 211
    },
    {
      difficulty: 3,
      id: 1,
      name: "მოდულით შებრუნებული da...",
      subject: "მათემატიკა",
      grade: 12,
      count: 11
    },
    {
      difficulty: 2,
      id: 2,
      name: "dfs",
      grade: 6,
      subject: "ინფორმატიკა",
      count: 121
    },
    {
      difficulty: 1,
      id: 3,
      name: "for loop",
      grade: 5,
      subject: "ინფორმატიკა",
      count: 211
    },
    {
      difficulty: 1,
      id: 3,
      name: "for loop",
      grade: 5,
      subject: "ინფორმატიკა",
      count: 211
    }
  ];

  return (
    <div className='wrapper'>
      <div className="subjects">
        {
          data.map((name, ind) => {
            return (
              <Link to={`/problemset/${name}`} className="subject" key={ind}>
                {name}
              </Link>
            )
          })
        }
      </div>
      
      <div className="list">
        <div className="header">
          <p>ყველა ამოცანა</p>
          <input type='text' placeholder='ნომრით ძებნა'/>
        </div>

        <div className="problems">
          <div className="problem problemsHeader" key={"header"}>
            <div className='problemChilds' id="id">№</div>
            <div className='problemChilds' id="name">ამოცანა</div>
            <div className='problemChilds' id="subject">საგანი</div>
            <div className='problemChilds' id="grade">კლასი</div>
            <div className='problemChilds' id="count"></div>
          </div>
          {
            problems.map(({difficulty, id, name, subject, grade, count}, ind) => {
              return (
                <Link to={`/problemset/problem/${id}`} className="problem" key={ind}>
                  <div className='problemChilds' id="difficulty"
                    style={{
                      backgroundColor: difficulty == 1 ? "#6AFE9C" : difficulty == 2 ? "#EBFF70" : "#FF725F"
                    }}
                  ></div>

                  <div className='problemChilds' id="id">{id}</div>
                  <div className='problemChilds' id="name">{name}</div>
                  <div className='problemChilds' id="subject">{subject}</div>
                  <div className='problemChilds' id="grade">{grade}</div>
                </Link>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Problemset