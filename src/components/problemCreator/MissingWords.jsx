import React, { useEffect, useState } from 'react'

function MissingWords({ setFormData }) {
  //wp - workplace
  const [wpData, setWpData] = useState({
    coefficient: 0,
    display: {
      text: [],
      words: [],
    },
    remWords: [],
    answer: [],
  })
  const [text, setText] = useState('');
  const [word, setWord] = useState('');
  const [rem, setRem] = useState('');

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('AddProblemFormData'));
    if (savedData && savedData.workplaceData) {
      setWpData(savedData.workplaceData);
    }
  }, [])

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      workplaceData: wpData
    }))
  }, [wpData]);

  return (
    <div>
      { (wpData && wpData.display && wpData.display.text) ?
        <div>
          {
            wpData.display.text.map((obj, ind) => {
              return (
                <span key={ind} style={{color: obj.type === 'word' ? 'red' : ''}}
                onClick={() => {
                  const newText = wpData.display.text.filter(val => val != obj);
                  const newWords = (wpData.words ? wpData.display.words.filter(val => val != obj.value) : []);
                  const newAnswer = (wpData.answer ? wpData.answer.filter(val => val != obj.value) : []);
                  setWpData({
                    ...wpData,
                    display: {
                      text: newText,
                      words: newWords
                    },
                    answer: newAnswer,
                    coefficient: newAnswer.length
                  })
                }}>
                  {`${obj.value} `}
                </span>
              )
            })
          }
        </div> : <></>
      }
      <div className='addPostRow'>
        <input
          type='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='ტექსტის დამატება'
        />
        <button type='button' onClick={() => {
          setWpData((prevData) => ({
            ...wpData,
            display: {
              text: [...(prevData.display.text || []), {
                type: 'text',
                value: text,
              }],
              words: [...(prevData.display.words || [])],
            }
          }))
          setText('');
        }}>დამატება</button>
      </div>
      <div className='addPostRow'>
        <input
          type='text'
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder='სიტყვის დამატება'
        />
        <button type='button' onClick={() => {
          setWpData((prevData) => ({
            ...wpData,
            display: {
              text: [...(prevData.display.text || []), {
                type: 'word',
                value: word,
              }],
              words: [...(prevData.display.words || []), word],
            },
            answer: [...(prevData.answer || []), word],
            coefficient: [...(prevData.answer || []), word].length,
          }))
          setWord('');
        }}>დამატება</button>
      </div>
      <div className='addPostRow'>
        <input
          type='text'
          value={rem}
          onChange={(e) => setRem(e.target.value)}
          placeholder='ზედმეტი სიტყვის დამატება'
        />
        <button type='button' onClick={() => {
          setWpData((prevData) => ({
            ...wpData,
            display: {
              text: [...(prevData.display.text || [])],
              words: [...(prevData.display.words || []), rem],
            },
            remWords: [...(prevData.remWords || []), rem]
          }))
          setRem('');
        }}>დამატება</button>
      </div>
      { (wpData && wpData.remWords && wpData.remWords.length > 0) ?
        <div>
          ზედმეტი სიტყვები: 
          {
            wpData.remWords.map((obj, ind) => {
              return (
                <span key={ind} onClick={() => {
                  const newWords = (wpData.display.words ? wpData.display.words.filter(val => val != obj) : []);
                  const newRemWords = (wpData.remWords ? wpData.remWords.filter(val => val != obj) : []);
                  setWpData({
                    ...wpData,
                    display: {
                      text: wpData.display.text,
                      words: newWords
                    },
                    remWords: newRemWords
                  })
                }}>
                  {`${obj} `}
                </span>
              )
            })
          }
        </div> : <></>
      }
    </div>
  )
}

export default MissingWords
