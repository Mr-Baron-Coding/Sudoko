import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logTime } from '../features/stopwatchSlice.js';
import './CompStyle.css';

export default function Stopwatch() {
  const dispatch = useDispatch();
  const elapsedTime = useSelector((state) => state.stopwatch.savedTime);
  const isTimeRunning = useSelector((state) => state.stopwatch.running);
  const gameShown = useSelector((state) => state.table.showValue);
  
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval;
    if ( isTimeRunning ) {
      if ( elapsedTime === 0 ) {
        setTime(0);
      }
      interval = setInterval(() => {
          setTime((prev) => prev + 10);
      }, 10);
    } 
    else if ( !isTimeRunning ) {
      if ( elapsedTime === 0 && !gameShown ) { 
        setTime(0);
      }
      dispatch(logTime(time));
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    }
  }, [isTimeRunning, gameShown]);
    
  return (
    <div className="numbers">
      <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}</span>   {/* minutes */}
      <span>:</span>
      <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>    {/* seconds */}
      <span>:</span>
      <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>               {/* milliseconds */}
    </div>
  )
};