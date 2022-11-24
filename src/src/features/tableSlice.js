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
        isGameWon: false,
        userList: []
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
        gameWon: (state, action) => {
            state.isGameWon = action.payload;               // has the user won
        },
        addUser: (state, action) => {
            console.log(action.payload);                   // add user and time 
            state.userList = [
                ...state.userList, { userName: action.payload.user, time: action.payload.time, difficulty: action.payload.diff, score: 0 }
            ]
        }
    }
});

export const { showTable, gameDifficulty, tempDiff, checkGame, autoFillInput, superEasy, gameWon, addUser } = tableSlice.actions;

export default tableSlice.reducer;