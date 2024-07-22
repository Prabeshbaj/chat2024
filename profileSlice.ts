import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ProfileState {
  profilePicture: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProfileState = {
  profilePicture: null,
  status: 'idle',
  error: null,
};

// Async thunk to fetch profile data
export const fetchProfileData = createAsyncThunk('profile/fetchProfileData', async () => {
  const response = await axios.get('/api/profile', { responseType: 'arraybuffer' }); // Adjust the API endpoint
  const base64Image = Buffer.from(response.data, 'binary').toString('base64');
  return `data:image/png;base64,${base64Image}`; // Adjust the image type if necessary
});

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profilePicture = action.payload;
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch profile data';
      });
  },
});

export default profileSlice.reducer;
