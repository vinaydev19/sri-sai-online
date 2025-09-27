import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        profile: null,
        email: null
    },
    reducers: {
        getUser: (state, action) => {
            state.user = action.payload;
        },
        getMyProfile: (state, action) => {
            state.profile = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.profile = null;
            state.email = null;
        }
    },
});

export const { getUser, getMyProfile, getEmail, logout } = userSlice.actions;

export default userSlice.reducer;