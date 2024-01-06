import React, { useEffect, useRef, useState } from 'react'
import './ProblemsetProblem.scss'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux';
import { selectUserId } from '../features/userSlice';

const Choice = ({data}) => {
  const variantRefs = data.variants.map(() => useRef(null));
  const mp = new Map();
  const [verdict, setVerdit] = useState(false);
  const [tries, setTries] = useState(0);
  const userId = useSelector(selectUserId);
  let usedCnt = 0;

  data.variants.sort(() => Math.random() - 0.5);

  const updateStatus = (variant, index) => {
    variantRefs[index].current.classList.toggle('problemActive');
    if (variantRefs[index].current.classList.contains('problemActive')) {
      mp.set(variant, true);
      usedCnt++;
    } else {
      mp.set(variant, false);
      usedCnt--;
    }
  }

  useEffect(() => {
    if (tries > 0) alert(verdict);
    for (let i = 0; i < data.variants.length; i++) {
      variantRefs[i].current.classList.remove('problemActive');
    }
    data.variants.sort(() => Math.random() - 0.5);
    mp.clear();
  }, [tries]);

  const check = () => {
    let ans = true;
    if (usedCnt != data.answers.length) ans = false;
    for (let i = 0; i < data.answers.length; i++) {
      if (mp.get(data.answers[i]) !== true) ans = false;
    }
    setVerdit(ans);
    setTries(tries + 1);
  }

  return (
    <div>
      <div className="problemTutorial">* აირჩიეთ ყველა სწორი პასუხი</div>
      <div className='problemSolutionContainer'>
        {
          data.variants.map((variant, ind) => {
            return (
              <button ref={variantRefs[ind]} className='problemVariant' key={ind} onClick={() => (updateStatus(variant, ind))}>
                <p>{variant}</p>
              </button>
            )
          })
        }
      </div>
      <div className='problemSubmit'>
        {
          userId ? (
            <button onClick={() => {check()}}>დადასტურება</button>
          ) : (
            <div>ასატვირთად გაიარეთ ავტორიზაცია</div>
          )
        }
      </div>
    </div>
  )
}

const Order = (data) => {
  return (
    <div className='problemSolutionContainer'>order</div>
  )
}

const PlaceIn = (data) => {
  return (
    <div className='problemSolutionContainer'>placeIn</div>
  )
}

const WriteNumber = ({data}) => {
  const [val, setVal] = useState('');

  const check = () => {
    let ans = (parseInt(val) === data.answer ? true : false);
    alert(ans);
    setVal('');
  }

  return (
    <div>
      <div className="problemTutorial">* ჩაწერეთ შესაბამისი მთელი რიცხვი</div>
      <div className='problemSolutionContainer'>
        <input value={val} onChange={(e) => {setVal(e.target.value)}} type='number' className='writeInput'/>
        <div className='problemSubmit'>
        {
          userId ? (
            <button onClick={() => {check()}}>დადასტურება</button>
          ) : (
            <div>ასატვირთად გაიარეთ ავტორიზაცია</div>
          )
        }
        </div>
      </div>
    </div>
  )
}

const ProblemSolution = ({data}) => {
  const { problemId } = useParams();
  if (data[problemId - 1].type === "4choice") return <Choice data={data[problemId - 1]}/>
  if (data[problemId - 1].type === "order") return <Order data={data[problemId - 1]}/>
  if (data[problemId - 1].type === "placeIn") return <PlaceIn data={data[problemId - 1]}/>
  if (data[problemId - 1].type === "writeNumber") return <WriteNumber data={data[problemId - 1]}/>
}

function ProblemsetProblem() {
  const { problemId } = useParams();
  const data = {
      "id": 1,
      "name": "მეგატვინი 2020",
      "statement": "AiaSoft-ზე ხშირად იმართება ხოლმე შეჯიბრებები დაპროგრამებაში. დღევანდელ, 2020 წლის ფინალურ შეჯიბრზე კი გადაწყდება ვინ გახდება მეგატვინი 2020-ის წოდების მფლობელი. ამ წოდების მოსაპოვებლად თქვენ შემდეგი ამოცანის ამოხსნა დაგჭირდებათ:მოცემულია N რიცხვიანი მიმდევრობა. განვიხლილოთ ამ მიმდევრობის ყველა შესაძლო ქვემიმდევრობა და მათი ჯამები. თქვენი მიზანია იპოვოთ ქვემიმდევრობები, რომლეთა ელემენტების ჯამის X-ზე დაქსორვისას (XOR) მინიმალურ რიცხვს ვიღებთ. * XOR - გამომრიცხავი ან ოპერაციაა",
      "contestId": 0,
      "solutions": [
        {
          "type": "4choice",
          "variants": ["ვარიანტი 1", "ვარიანტი 2", "ვარიანტი 3", "ვარიანტი 4", "varianti 5", "varianti 6", "varianti 7"],
          "answers": ["ვარიანტი 1", "ვარიანტი 3"]
        },
        {
          "type": "order",
          "variants": ["ვარიანტი 1", "ვარიანტი 2", "ვარიანტი 3", "ვარიანტი 4"],
          "answer": ["ვარიანტი 4", "ვარიანტი 3", "ვარიანტი 2", "ვარიანტი 1"]
        },
        {
          "type": "placeIn",
          "variants": ["ვარიანტი 1", "ვარიანტი 2", "ვარიანტი 3", "ვარიანტი 4"],
          "answer": ["ვარიანტი 1", "ვარიანტი 3", "ვარიანტი 2", "ვარიანტი 4"]
        },
        {
          "type": "writeNumber",
          "answer": -11
        },
      ]
  }

  return (
    <div className='problemContainer'>
      <div className="problemHeader">
        <h1>{data.name}</h1>
      </div>
      <div className="problemStatement">
        <p>{data.statement}</p>
      </div>
      <ProblemSolution data={data.solutions}/>
    </div>
  )
}

export default ProblemsetProblem