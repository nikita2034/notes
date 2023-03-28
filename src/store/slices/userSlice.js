import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    email: null,
    token: null,
    id: null,
    data:[]
};


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.email = action.payload.email;
            state.token = action.payload.token;
            state.id = action.payload.id;
            state.data = action.payload.data
        },
        removeUser(state) {
            state.email = null;
            state.token = null;
            state.id = null;
            state.data = null
        }
    }
})
export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;