import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from './store'; // Adjust the import according to your store setup

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
  promptSent: boolean;
}

const initialState: MainChatState = {
  conversations: [],
  status: 'idle',
  error: null,
  promptSent: false,
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
export const createChatData = createAsyncThunk<ChatMessage, { crewId: string, requestId: string, responseId: string, chat: ChatMessage }, { dispatch: AppDispatch }>(
  'mainChat/createChatData',
  async ({ crewId, requestId, responseId, chat }, { dispatch }) => {
    await axios.post('/crewChatDynamo/createData', {
      CrewId: crewId,
      RequestId: requestId,
      ResponseId: responseId,
      Chat: chat,
    });
    dispatch(setRequestId(requestId)); // Dispatch action from another slice
    return chat;
  }
);

// Async thunk to create chat history with new requestId
export const createChatHistory = createAsyncThunk<string, { crewId: string, requestId: string, responseId: string, topic: string, label: string, isPinned: boolean, isArchived: boolean }>(
  'mainChat/createChatHistory',
  async ({ crewId, requestId, responseId, topic, label, isPinned, isArchived }) => {
    await axios.post('/crewChatDynamo/createHistory', {
      CrewId: crewId,
      RequestId: requestId,
      ResponseId: responseId,
      Topic: topic,
      ChatAttributes: {
        Label: label,
        IsPinned: isPinned,
        IsArchived: isArchived,
      }
    });
    return requestId;
  }
);

const mainChatSlice = createSlice({
  name: 'mainChat',
  initialState,
  reducers: {
    setPromptSent: (state, action: PayloadAction<boolean>) => {
      state.promptSent = action.payload;
    },
  },
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
      .addCase(createChatData.fulfilled, (state, action: PayloadAction<ChatMessage>) => {
        state.status = 'succeeded';
        state.conversations.push(action.payload);
      })
      .addCase(createChatHistory.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        // Optionally, handle the new requestId here if needed
      });
  },
});

export const { setPromptSent } = mainChatSlice.actions;

export default mainChatSlice.reducer;
