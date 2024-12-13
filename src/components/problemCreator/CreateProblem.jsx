import React from 'react'
import MultipleChoice from '@components/problemCreator/MultipleChoice';
import Matching from '@components/problemCreator/Matching';
import Sorting from '@components/problemCreator/Sorting';
import WriteNumber from '@components/problemCreator/WriteNumber';
import MissingWords from '@components/problemCreator/MissingWords';
import TextType from '@components/problemCreator/TextType';

function CreateProblem({ setFormData, type }) {
  switch (type) {
    case 'ვარიანტების არჩევა':
      return <MultipleChoice setFormData={setFormData}/>;
    case 'შესაბამისობა': 
      return <Matching setFormData={setFormData}/>;
    case 'დალაგება': 
      return <Sorting setFormData={setFormData}/>;
    case 'რიცხვის ჩაწერა': 
      return <WriteNumber setFormData={setFormData}/>;
    case 'გამოტოვებული სიტყვები': 
      return <MissingWords setFormData={setFormData}/>;
    case 'ტექსტური':
      return <TextType setFormData={setFormData}/>;
    default:
      return <div>დაფიქსირდა შეცდომა</div>
  }
}

export default CreateProblem
