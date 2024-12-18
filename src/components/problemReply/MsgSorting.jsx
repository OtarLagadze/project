import React from 'react'

function MsgSorting({ data }) {
  console.log(data);
  return (
    <div>
      {
        data.map(({ value, verdict}, ind) => {
          return <div
            style={{boxShadow: `0px 6px 0px 0px ${verdict ? 'rgb(85, 255, 175)' : 'rgb(255, 78, 87)'}`}}
            key={ind} 
            className='msg'>
            <p>{value} {verdict === true ? 'სწორია' : 'არასწორია'}</p>
          </div>
        })
      }
    </div>
  )
}

export default MsgSorting
