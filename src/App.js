import React, { useEffect } from 'react';

import './App.css';

import GameDisplay from './Sudoko/GameDisplay';

import { useMediaQuery } from '@mui/material';
import { useDispatch } from 'react-redux';
import { changeScreenSize } from './Sudoko/features/mobileSlice.js';
 

function App() {
  const dispatch = useDispatch();
  const matches = useMediaQuery('(max-width:1000px)');

  useEffect(() => {
    dispatch(changeScreenSize(matches));

  }, [matches, dispatch]);

  return (
    <div className="App">            
      <GameDisplay />
    </div>
  );
};

export default App;