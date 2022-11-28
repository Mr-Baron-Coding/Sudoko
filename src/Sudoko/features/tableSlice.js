import { createSlice } from '@reduxjs/toolkit';

const initialTable = false;

export const tableSlice = createSlice({
    name: 'table',
    initialState: {
        showValue: initialTable,
        gameDiff: 0,
        temp_Diff: 0,
        checkGame: false,
        fill: false,
        easyMode: false,
        isGameEnd: false,
        isGameWon: false,
        mobileKeyPress: 0
    },
    
    reducers: {
        showTable: (state, action) => {
            state.showValue = action.payload                // Show game full game table          
        },
        gameDifficulty: (state, action) => {
            state.gameDiff = action.payload;                // the game difficulty - how many numbers displayed on screen
        },
        tempDiff: (state, action) => {
            state.temp_Diff = action.payload;               // temp game diff for checking
        },
        checkGame: (state, action) => {
            state.checkGame = action.payload;               // check the users input against the game table
        },
        autoFillInput: (state, action) => {
            state.fill = action.payload;                    // fill the input table
        },
        superEasy: (state, action) => {
            state.easyMode = action.payload;                // for the lazy
        },
        isGameEnd: (state, action) => {
            state.isGameEnd = action.payload;               // check is table filled
        },
        gameWon: (state, action) => {
            state.isGameWon = action.payload;               // has the user won
        },
        mobileKeyboardPress: (state, action) => {
            state.mobileKeyPress = action.payload;          // user's press on key board
        }
    }
});

export const { showTable, gameDifficulty, tempDiff, checkGame, autoFillInput, superEasy, isGameEnd, gameWon, mobileKeyboardPress } = tableSlice.actions;

export default tableSlice.reducer;