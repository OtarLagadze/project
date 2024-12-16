import { MathJax } from 'better-react-mathjax'
import React from 'react'

function MsgMatching({ data }) {
  return (
    <div>
      {
        data.map(({ value, verdict}, ind) => {
          return <div
            style={{boxShadow: `0px 6px 0px 0px ${verdict ? 'rgb(85, 255, 175)' : 'rgb(255, 78, 87)'}`}}
            key={ind} 
            className='msg'>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <p>{value.first}</p>
                <p>{` -----> `}</p>
                <MathJax className='mathElement'>{value.second}</MathJax>
                {/* <p>{verdict === true ? 'სწორია' : 'არასწორია'}</p> */}
              </div>
          </div>
        })
      }
    </div>
  )
}

export default MsgMatching
