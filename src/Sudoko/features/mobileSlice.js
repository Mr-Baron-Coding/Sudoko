import { createSlice } from "@reduxjs/toolkit";

export const mobileSlice = createSlice({
    name: 'mobile',
    initialState: {
        isMobile: false,
        menuOpend: false,
        screenNumber: 0
    },
    reducers: {
        changeScreenSize: (state, action) => {
            state.isMobile = action.payload;
        },
        openClose: (state, action) => {
            state.menuOpend = action.payload;
        },
        openMenuScreen: (state, action) => {
            state.screenNumber = action.payload;
        }
        
    },
});

export const { changeScreenSize, openClose, openMenuScreen } = mobileSlice.actions;

export default mobileSlice.reducer;