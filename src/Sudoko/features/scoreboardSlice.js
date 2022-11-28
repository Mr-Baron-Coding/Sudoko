import { createSlice } from "@reduxjs/toolkit";

export const scoreboardSlice = createSlice({
    name: 'scoreboard',
    initialState: {
        userList: []
    },
    reducers: {
        addUser: (state, action) => {
            console.log(action.payload);                   // add user and time 
            state.userList = [
                ...state.userList, { userName: action.payload.user, time: action.payload.time, difficulty: action.payload.diff, score: 0 }
            ]
        }
    }
});

export const { addUser } = scoreboardSlice.actions;

export default scoreboardSlice.reducer;