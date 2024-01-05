import React from 'react'
import { useParams } from 'react-router'
import './classPage.scss'
import { Link } from 'react-router-dom';

const Topic = (data) => {
    return (
        <div className='cpageTopic'>
            <h1>{data.name}</h1>
            {
                data.links.map((link, ind) => {
                    return (
                        <div className='cpageLink' key={ind}>
                            <a href={link} target='_blank' key={ind}>{link}</a>
                        </div>
                    )
                })

            }
            {
                data.problems.map((problem, ind) => {
                    return (
                        <div className='cpageProblem' key={ind}>
                            <Link to={`/problemset/problem/${problem}`}>{problem}</Link>
                        </div>
                    )
                })
            }
        </div>
    )
}

function ClassPage() {
  const params = useParams();
  const data = [
	{
		"name": "კვადრატული განტოლება",
		"links": ["https://ka.wikipedia.org/wiki/%E1%83%99%E1%83%95%E1%83%90%E1%83%93%E1%83%A0%E1%83%90%E1%83%A2%E1%83%A3%E1%83%9A%E1%83%98_%E1%83%92%E1%83%90%E1%83%9C%E1%83%A2%E1%83%9D%E1%83%9A%E1%83%94%E1%83%91%E1%83%90", "https://www.youtube.com/watch?v=baaQzB0IVpA&ab_channel=SilkSchool"],
		"problems": [1, 2, 3, 4, 5, 23, 12, 11, 123, 432, 120, 551]
	},

	{
		"name": "კვადრატული განტოლება",
		"links": ["https://ka.wikipedia.org/wiki/%E1%83%99%E1%83%95%E1%83%90%E1%83%93%E1%83%A0%E1%83%90%E1%83%A2%E1%83%A3%E1%83%9A%E1%83%98_%E1%83%92%E1%83%90%E1%83%9C%E1%83%A2%E1%83%9D%E1%83%9A%E1%83%94%E1%83%91%E1%83%90", "https://www.youtube.com/watch?v=baaQzB0IVpA&ab_channel=SilkSchool"],
		"problems": [23, 12, 111, 1232, 3, 120, 551]
	}
]
  return (
    <div className='cpageContainer'>
        <div className="cpageHeader">
            <h1>{params.subject}</h1>
        </div>
        {
            data.map(({name, links, problems}, ind) => {
                return <Topic name={name} links={links} problems={problems} key={ind} />
            })
        }
    </div>
  )
}

export default ClassPage