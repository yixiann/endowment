import React, { useEffect, useState } from 'react';

export const defaultpage = ({
  ...props
}) => {

  useEffect(() => {
    console.log("defaultpage")
  },[])
  

  return (
    <div className="defaultpage">
      <p>defaultpage</p>
    </div>
  )
}

export default defaultpage