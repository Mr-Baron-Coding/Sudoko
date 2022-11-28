import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dispalyBottomMessage } from '../features/messageSlice.js';
import { startWatch, resetWatch } from '../features/stopwatchSlice.js';
import { gameDifficulty, isGameEnd } from '../features/tableSlice.js';

import './CompStyle.css';

export default function BottomMenuField() {
    const dispatch = useDispatch();
    const tempDiff = useSelector((state) => state.table.temp_Diff);
    const userMess = useSelector((state) => state.messages.valueBottom);
    
    const startNewGame = () => {
        dispatch(isGameEnd(false));
        dispatch(dispalyBottomMessage(false));
        dispatch(resetWatch());
        dispatch(startWatch(true));
        dispatch(gameDifficulty(tempDiff - 1));             // start the game - add difficulty setting

    };

    const resumeGame = () => {
        dispatch(dispalyBottomMessage(false));
        dispatch(startWatch(true));

    };

    const userMessage = () => {
        return (
            <div className='startANewContainer'>
                <div className='questionStyle'>Start a new game<span className='blinkStyle'>?</span></div>
                <div className='clickDivOne' onClick={ () => startNewGame() }>Yes</div>               
                <div className='clickDivTwo' onClick={ () => resumeGame() }>No</div>
            </div>
        )
    };

    // solve game not refreshing on same difficulty button press 
    // messages and buttons for selecting and stoping stopwatch
  return (
       userMessage()
  )
}
