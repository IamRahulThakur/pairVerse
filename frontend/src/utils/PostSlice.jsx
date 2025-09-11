import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
  name: 'post',
  initialState: [], // start with empty array
  reducers: {
    setPosts: (state, action) => action.payload, // replace all posts
    addPost: (state, action) => { state.push(action.payload) }, // add one post
    clearPosts: () => [] // reset to empty
  }
})

export const { setPosts, addPost, clearPosts } = postSlice.actions;
export default postSlice.reducer;
