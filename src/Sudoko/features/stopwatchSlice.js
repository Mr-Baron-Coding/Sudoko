import { createSlice } from '@reduxjs/toolkit';

export const stopwatchSlice = createSlice({
    name: 'stopwatch',
    initialState: {
        running: false, 
        savedTime: 0
    },
    
    reducers: {
        startWatch: (state, action) => {
            state.running = action.payload              // start/stop Stopwatch         
        },
        logTime: (state, action) => {
            state.savedTime = action.payload;           // save logged time     
        },
        resetWatch: (state) => {
            state.savedTime = 0;                        // clear time
        }
    }
});

export const { startWatch, logTime, resetWatch } = stopwatchSlice.actions;

export default stopwatchSlice.reducer;