import React, { useState } from 'react';

import { showTable, isGameEnd, gameWon } from '../features/tableSlice.js';
import { addUser } from '../features/scoreboardSlice.js';
import { startWatch, resetWatch } from '../features/stopwatchSlice.js';
import { displayOverlayMessage } from '../features/messageSlice.js';
import { useSelector, useDispatch } from 'react-redux';

import '../Style.css';

export default function Messages() {
  const dispatch = useDispatch();
  const gameDiff = useSelector((state) => state.table.gameDiff);
  const time = useSelector((state) => state.stopwatch.savedTime);
  const isWinMess = useSelector((state) => state.messages.winMessage);
  const isntCorrect = useSelector((state) => state.messages.notCorrect);

  let [userName, setUserName] = useState(''); 

  // game won message
  const bigMessage = () => {
    return (
      <div className='messContainer'>
        <div className='saveInputContainer'>
          <div className='saveHeader'>Congratulation!</div>
          <input className='scoreInputName' placeholder='Enter Name' value={ userName } onChange={ (e) => setUserName(e.target.value) } />
          <div className='saveButton' onClick={ () => saveScore() }>Save</div>
              <div className='numbers'> 
                <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}</span>  
                <span>:</span>
                <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>   
                <span>:</span>
                <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>         
              </div>          
        </div>  
      </div>
    )
 
  };

  // save time and user name 
  // !! add score based on time and diff
  const saveScore = () => {
    let min = ("0" + Math.floor((time / 60000) % 60)).slice(-2);
    let sec = ("0" + Math.floor((time / 1000) % 60)).slice(-2);
    let milli = ("0" + ((time / 10) % 100)).slice(-2);
    console.log(userName, (min + ':' + sec + ':' + milli) , 0);
    dispatch(addUser({ user: userName, time: `${ min + ':' + sec + ':' + milli }`, diff: gameDiff , score: 0 }) );
    dispatch(gameWon(false));
    // start over same diff or zero out everything?? 
    dispatch(showTable(false));
    dispatch(resetWatch());
    dispatch(isGameEnd(false));
    dispatch(displayOverlayMessage(false));

  };

  // filled the board but incorectly
  const notYetDone = () => {
    return (
      <div className='messContainer'>
        <div className='errorMessContainer'>
          <div className='textMessage'>not yet!</div>
          <div className='continueButton' onClick={ () => continueGame() }>Continue?</div>
        </div>
      </div>
    )
  };

  const continueGame = () => {
    dispatch(displayOverlayMessage(false));
    dispatch(startWatch(true));
  };

  return (
    <>
      { isWinMess ? bigMessage() : null }
      { isntCorrect ? notYetDone() : null }
    </>
  )
};