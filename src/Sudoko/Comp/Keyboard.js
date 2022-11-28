import React from 'react';
import { useDispatch } from 'react-redux';
import { mobileKeyboardPress } from '../features/tableSlice.js';
import './CompStyle.css';

export default function Keyboard() {
    const dispatch = useDispatch();

    let keyBoard = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const selectedNumber = (num) => {
        dispatch(mobileKeyboardPress(num));
    };
  return (
    <div className='keyboardContainer'>
        { keyBoard.map((number) => {
            return (
                <div 
                    className={`keys key_${number}`} 
                    key={ number }
                    onClick={ () => selectedNumber(number) }
                    >
                        { number }     
                </div>
            )
        })}
    </div>
  )
}
