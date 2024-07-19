import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface ChatMessage {
  message: string;
  response: string;
  report: string;
  reaction: string;
}

interface MainChatState {
  conversations: ChatMessage[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MainChatState = {
  conversations: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch chat data
export const fetchChatData = createAsyncThunk<ChatMessage[], { crewId: string, requestId: string }>(
  'mainChat/fetchChatData',
  async ({ crewId, requestId }) => {
    const response = await axios.get(`/crewChatDynamo/getData?CrewId=${crewId}&RequestId=${requestId}`);
    return response.data.Chat;
  }
);

// Async thunk to create chat data
export const createChatData = createAsyncThunk<void, { crewId: string, requestId: string, chat: ChatMessage }>(
  'mainChat/createChatData',
  async ({ crewId, requestId, chat }) => {
    await axios.post('/crewChatDynamo/createData', {
      CrewId: crewId,
      RequestId: requestId,
      ...chat,
    });
  }
);

// Async thunk to create chat history
export const createChatHistory = createAsyncThunk<void, { crewId: string, requestId: string, topic: string, label: string, isPinned: boolean, isArchived: boolean }>(
  'mainChat/createChatHistory',
  async ({ crewId, requestId, topic, label, isPinned, isArchived }) => {
    await axios.post('/crewChatDynamo/createHistory', {
      CrewId: crewId,
      RequestId: requestId,
      Topic: topic,
      ChatAttributes: {
        Label: label,
        IsPinned: isPinned,
        IsArchived: isArchived,
      }
    });
  }
);

const mainChatSlice = createSlice({
  name: 'mainChat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChatData.fulfilled, (state, action: PayloadAction<ChatMessage[]>) => {
        state.status = 'succeeded';
        state.conversations = action.payload;
      })
      .addCase(fetchChatData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch chat data';
      })
      .addCase(createChatData.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(createChatHistory.fulfilled, (state) => {
        state.status = 'succeeded';
      });
  },
});

export default mainChatSlice.reducer;
