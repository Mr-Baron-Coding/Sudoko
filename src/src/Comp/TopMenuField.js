import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startWatch, resetWatch } from '../features/stopwatchSlice.js';
import { dispalyBottomMessage, displayModeButtons } from '../features/messageSlice.js';
import { checkGame, showTable, gameDifficulty, tempDiff, autoFillInput, superEasy, gameWon } from '../features/tableSlice.js';

import Stopwatch from './Stopwatch';
import './CompStyle.css';

export default function TopMenuField() {
    const dispatch = useDispatch();
    const userMess = useSelector((state) => state.messages.valueBottom);            // display message ?
    const diffButtons = useSelector((state) => state.messages.diffButtons);         // display buttons
    const isTimeRunning = useSelector((state) => state.stopwatch.running);          // is stopwatch running
    const isGameChecked = useSelector((state) => state.table.checkGame);            // are we checking the game after submit?
    const isEasyMode = useSelector((state) => state.table.easyMode);

    const [modeButtons, setModeButtons] = useState([                                // mode buttons
        { text: 'Easy', id: 1, number: Math.floor(Math.random() * (36 - 32 + 1) ) + 32 },
        { text: 'Medium', id: 2, number: Math.floor(Math.random() * (26 - 24 + 1) ) + 24 },
        { text: 'Hard', id: 3, number: Math.floor(Math.random() * (16 - 14 + 1) ) + 14 }
    ]);

    let easyColor = isEasyMode ? 'pink' : 'black';

    const openMenu = () => {
        dispatch(displayModeButtons(true));

    }

    const beginTimer = (diff) => {
        if ( isTimeRunning === true ) {
            // debugger
            dispatch(startWatch(false));
            dispatch(dispalyBottomMessage(true));
            dispatch(displayModeButtons(false));
            dispatch(tempDiff(diff-1));             // start the game - add difficulty setting
        }
        else {
            // debugger
            if ( isGameChecked ) {
                dispatch(checkGame(false));
                dispatch(resetWatch());

            }

            dispatch(gameDifficulty(diff));             // start the game - add difficulty setting
            dispatch(startWatch(true));
            dispatch(showTable(true));
            dispatch(dispalyBottomMessage(false));
            dispatch(displayModeButtons(false));
            dispatch(gameWon(false));
        }
        
    };

    const makeItSuperEasy = () => {
        dispatch(superEasy(!isEasyMode));
        console.log('LOL');
    };

    // const disableButtons = () => {
    //     dispatch(disableModeButtons(true));
    //     console.log(isDisabled);
    //     setModeButtons([
    //         ...modeButtons,
    //         modeButtons.map((button) => button.disabled = !button.disabled )
    //     ])
    // };

  return (
    <div style={{ marginBottom: '2rem' }}>
        <div>
                <div style={{ display: 'flex' , width: '30.3rem', margin: 'auto', justifyContent: 'center', justifyItems: 'stretch' }}>
                    <div style={{ margin: '1rem'}} onClick={ () => openMenu() }>New Game</div>
                    <div style={{ margin: '1rem'}} onClick={ () => dispatch(autoFillInput(true))}>Auto fill</div>  {/* remove */}
                    <div style={{ margin: '1rem', color:  easyColor }} onClick={ () => makeItSuperEasy() }>SuperEasy</div>  {/* remove */}
                    <div style={{ margin: '1rem'}}><Stopwatch /></div>
                </div>
                <div style={{ display: 'flex' , width: '30.3rem', margin: 'auto', justifyContent: 'center' }}>
                    { diffButtons 
                                ? modeButtons.map((button, i) => {
                                    return (
                                        <div style={{ margin: '1rem'}} key={ `${button.text}`}>
                                            <button 
                                                onClick={ () => beginTimer(button.number) } 
                                                className='diffButtons'
                                            >
                                                { button.text }
                                            </button>
                                        </div>
                                    )
                                })
                                : null
                    }
                </div>                
            </div>
    </div>
  )
}
