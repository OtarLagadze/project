import React, { useEffect, useState } from 'react';

function WpMissingWords({ data, setSubmission }) {
  const blankSpace = '_______';
  
  const [filledText, setFilledText] = useState(
    data.display.text.map(item => 
      item.type === 'word' ? { ...item, value: blankSpace } : item
    )
  );
  const [selectedWords, setSelectedWords] = useState([]);
  const [words, setWords] = useState([...data.display.words].sort(() => Math.random() - 0.5));

  const updateStatus = (word) => {
    if (selectedWords.length === data.answer.length) return;
    let placed = false;
    const newText = filledText.map((item) => {
      if (item.type === 'word' && item.value === blankSpace && !placed) {
        placed = true;
        item.value = word;
        return item;
      }
      return item;
    });

    const newWords = [...words];
    const wordIndex = newWords.indexOf(word);
    if (wordIndex !== -1) {
      newWords.splice(wordIndex, 1);
    }

    setFilledText(newText);
    setSelectedWords([...selectedWords, word]);
    setWords(newWords);
  };

  useEffect(() => {
    if (selectedWords.length !== data.answer.length) return;
    setSubmission(selectedWords);
  }, [selectedWords]);

  const reset = () => {
    setFilledText(data.display.text.map(item => 
      item.type === 'word' ? { ...item, value: blankSpace } : item
    ));
    setSelectedWords([]);
    setWords([...data.display.words].sort(() => Math.random() - 0.5));
    setSubmission(null);
  };

  return (
    <div>
      <div>
        <div>
          {
            filledText.map(({ type, value }, ind) => (
              <span key={ind} style={{ color: type === 'word' ? 'red' : '' }}>{value} </span>
            ))
          }
        </div>
        <div className='problemSolutionContainer'>
          {
            words.map((word, ind) => (
              <button className='problemVariant' key={ind} onClick={() => updateStatus(word)}>
                <p>{word}</p>
              </button>
            ))
          }
        </div>
      </div>
      <button className='problemVariant' onClick={reset}>თავიდან</button>
    </div>
  );
}

export default WpMissingWords;
