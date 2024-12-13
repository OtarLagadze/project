import React, { useEffect } from 'react'

function TextType({ setFormData }) {
  const wpData = {
    coefficient: 0,
    display: [],
    answer: [],
  };
  useEffect(() => {
    setFormData(prev => {
      const {workplaceData, point, ...rest} = prev || {};
      return {point: "0", workplaceData: wpData, ...rest};
    })
  }, []);
}

export default TextType
