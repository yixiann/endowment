import React, { useEffect, useState } from 'react';

export const Aboutpage = ({
  ...props
}) => {

  useEffect(() => {
    console.log("aboutpage")
  },[])
  

  return (
    <div className="aboutpage">
      <p>aboutpage</p>
    </div>
  )
}

export default Aboutpage