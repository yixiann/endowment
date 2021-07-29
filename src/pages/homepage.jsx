import React, { useEffect, useState } from 'react';
import { Button, Table, Form, Input, Typography } from 'antd';
import DendrogramPage from '../visxBarGraph/DendrogramPage';

export const HomePage = ({
  ...props
}) => {
  
  const {Title} = Typography

  return (
    <div className="Home" style={{padding: "10px"}}>
      <DendrogramPage/>
    </div>
  )
}

export default HomePage