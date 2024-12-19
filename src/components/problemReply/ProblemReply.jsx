import React from 'react'
import MsgMultipleChoice from './MsgMultipleChoice';
import MsgMatching from './MsgMatching';
import MsgSorting from './MsgSorting';
import MsgWriteNumber from './MsgWriteNumber';
import './MsgVerdict.scss'

const ComponentToRender = ({ type, data }) => {
  switch (type) {
    case 'ვარიანტების არჩევა':
      return <MsgMultipleChoice data={data}/>;
    case 'შესაბამისობა': 
      return <MsgMatching data={data}/>;
    case 'დალაგება': 
      return <MsgSorting data={data}/>;
    case 'რიცხვის ჩაწერა': 
      return <MsgWriteNumber data={data}/>;
    case 'გამოტოვებული სიტყვები': 
      return <MsgSorting data={data}/>;
    default:
      return <div>დაფიქსირდა შეცდომა</div>
  }
}

function ProblemReply({ replyData }) {
  if (!replyData) return;
  return <>
    <div className="problemHeader">
      ქულა: {replyData.evaluator.pointsEarned} / {replyData.maxPoint}
    </div>
    <ComponentToRender type={replyData.type} data={replyData.evaluator.verdict}/>
  </>
}

export default ProblemReply
