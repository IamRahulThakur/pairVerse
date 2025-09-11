import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: 'user', 
    initialState: null,
    reducers: {
        addConnection: (state, action) => {
            return action.payload;
        },
        removeConnection: () => {
            return null;
        }
    }   
})

export const {addConnection, removeConnection} = connectionSlice.actions;

export default connectionSlice.reducer;