import React from 'react';

import TopMenuField from './Comp/TopMenuField.js'
import GameCalc from './Comp/GameCalc.js';
import Stopwatch from './Comp/Stopwatch.js';
import SubmitButton from './Comp/SubmitButton.js';
import BottomMenuField from './Comp/BottomMenuField.js';
import TableLineStyling from './Comp/TableLineStyling.js';
import Keyboard from './Comp/Keyboard.js';
import Messages from './Comp/Messages.js';

import { useSelector } from 'react-redux';

import './Style.css';

export default function GameDisplay() {
  const showGame = useSelector((state) => state.table.showValue);
  const isMobile = useSelector((state) => state.mobile.isMobile);
  const overlay = useSelector((state) => state.messages.overlayMessage);
  const userMess = useSelector((state) => state.messages.valueBottom);


  return (
    <div className='sudokoCompStyle'>
      { overlay ? <Messages /> : null }
      <div className='startStyle'><TopMenuField /></div>
      <div className='timerStyle'><Stopwatch /></div>
      <div className='submitStyle'><SubmitButton /></div>
      {userMess ? <div className='bottomStyle'><BottomMenuField /></div> : null } 
      <div className='gameContainer'><GameCalc />
        <div className='overflowStyle'><TableLineStyling /></div>
      </div>
      { showGame && isMobile ? <div className='keyboardStyle'><Keyboard /></div> : null }
    </div>
  )
};
