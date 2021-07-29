import React, { useEffect, useState } from 'react';
import BargroupPage from '../visxBarGraph/BargroupPage';

export const Aboutpage = ({
  ...props
}) => {

  useEffect(() => {
    console.log("aboutpage")
  },[])
  

  return (
    <div className="aboutpage">
      <BargroupPage/>
    </div>
  )
}

export default Aboutpage