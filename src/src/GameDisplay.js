import React, { useState } from 'react';

import TopMenuField from './Comp/TopMenuField.js'
import BottomMenuField from './Comp/BottomMenuField.js';
import GameCalc from './Comp/GameCalc.js';
import './Style.css';
import { gameWon, addUser } from './features/tableSlice.js';

import { useSelector, useDispatch } from 'react-redux';

export default function GameDisplay() {
  const dispatch = useDispatch();
  const isGameWon = useSelector((state) => state.table.isGameWon);
  const gameDiff = useSelector((state) => state.table.gameDiff);
  const time = useSelector((state) => state.stopwatch.savedTime);

  let [userName, setUserName] = useState('');

  const bigMessage = () => {
    return (
      <div className='container'>
        <div style={{ opacity: '5', margin: 'auto', marginTop: '15rem', backgroundColor: 'white', width: '50%'}}>
          <h1>Congratulation</h1>
          <input className='scoreInputName' value={ userName } onChange={ (e) => setUserName(e.target.value) } />
          <div onClick={ () => saveScore() }>Save score 
            <div> 
              <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>  
              <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>   
              <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>         
            </div>          
          </div>
        </div>
      </div>
    )
      
  };

  const saveScore = () => {
    debugger
    let min = ("0" + Math.floor((time / 60000) % 60)).slice(-2);
    let sec = ("0" + Math.floor((time / 1000) % 60)).slice(-2);
    let milli = ("0" + ((time / 10) % 100)).slice(-2);
    console.log(userName, (min + ':' + sec + ':' + milli) , 0);
    dispatch(addUser({ user: userName, time: `${ min + ':' + sec + ':' + milli }`, diff: gameDiff , score: 0 }) );
    dispatch(gameWon(false));
  };

  return (
    <div>
      { isGameWon ? bigMessage() : null }
        <TopMenuField />
        <BottomMenuField />
        <GameCalc />
    </div>
  )
};
