import { createSlice } from "@reduxjs/toolkit";

const initialMessage = false;

export const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        valueBottom: initialMessage,
        // modeButtons: initialMessage,
        gamePaused: initialMessage,
        diffButtons: initialMessage,
        overlayMessage: initialMessage,
        winMessage: initialMessage,
        notCorrect: initialMessage
        
    },
    
    reducers: {
        dispalyBottomMessage: (state, action) => {
            state.valueBottom = action.payload;              // display "are you sure" message         
        },
        displayModeButtons: (state, action) => {
            state.diffButtons = action.payload;             // display the difficulty buttons
        },
        displayOverlayMessage: (state, action) => {
            state.overlayMessage = action.payload;          // display overlay
            if ( action.payload === false ) {
                state.winMessage = false;
                state.notCorrect = false;
            }
        },
        displayWinMessage: (state, action) => {             
            state.winMessage = action.payload;              // display win
        },
        displayNotCorrect: (state, action) => {
            state.notCorrect = action.payload;              // display 'keep trying'
        }
    }
});

export const { dispalyBottomMessage, displayModeButtons, displayOverlayMessage, displayWinMessage, displayNotCorrect } = messageSlice.actions;

export default messageSlice.reducer;