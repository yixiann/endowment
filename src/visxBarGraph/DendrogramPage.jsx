import React, { useState, useEffect } from 'react';
import DendrogramChart from './DendrogramChart';

const DendrogramPage = () => {

    const clusterData = {
        name: "F1",
        walletAddress: 'tester',
        amount: 100,
        children: [
            {name: "A1", walletAddress: "test1", amount: '$1,001'},{name: "A2", walletAddress: "test1", amount: '$1,001'},
            {name: "B1", walletAddress: "test2", amount: '$1,002'},{name: "B2", walletAddress: "test2", amount: '$1,002'},
            {name: "C1", walletAddress: "test3", amount: '$1,003'},{name: "C2", walletAddress: "test3", amount: '$1,003'},
            {name: "D1", walletAddress: "test4", amount: '$1,004'},{name: "D2", walletAddress: "test4", amount: '$1,004'},
            {name: "E1", walletAddress: "test5", amount: '$1,005'},{name: "E2", walletAddress: "test5", amount: '$1,005'},
            {name: "F1", walletAddress: "test1", amount: '$1,001'},{name: "F2", walletAddress: "test1", amount: '$1,001'},
            {name: "G1", walletAddress: "test2", amount: '$1,002'},{name: "G2", walletAddress: "test2", amount: '$1,002'},
        ]
    }

    return (
        <>
            <div style={{overflow:'scroll', height: '2000px'}}>
                <DendrogramChart width={1000} height={600} clusterData={clusterData} numberOfNodes={clusterData.children?.length}/>
            </div> 
        </>
    )
}

export default DendrogramPage
