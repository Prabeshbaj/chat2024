import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the types for your state
interface Topic {
  requestId: string;
  topic: string;
  label: string;
}

interface ChatAttributes {
  Label: string;
  IsArchived: string;
  IsPinned: string;
}

interface LabelResponse {
  Labels: string[];
}

interface TopicResponse {
  ModifiedOn: string;
  RequestId: string;
  ChatAttributes: ChatAttributes;
  CreatedOn: string;
  CrewId: string;
  Topic: string;
}

interface SidebarState {
  labels: string[];
  topics: Record<string, Topic[]>;
  recentTopics: Topic[];
  pinnedTopics: Topic[];
  selectedLabel: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define the initial state using the interface
const initialState: SidebarState = {
  labels: [],
  topics: {},
  recentTopics: [],
  pinnedTopics: [],
  selectedLabel: null,
  status: 'idle',
  error: null,
};

// Async thunk to fetch labels
export const fetchLabels = createAsyncThunk('sidebar/fetchLabels', async (crewId: string) => {
  const response = await axios.get<LabelResponse>(`/api/retrieveProfile?crewId=${crewId}`);
  return response.data.Labels;
});

// Async thunk to fetch topics
export const fetchTopics = createAsyncThunk('sidebar/fetchTopics', async (crewId: string) => {
  const response = await axios.get<TopicResponse[]>(`/api/getHistory?crewId=${crewId}`);
  return response.data;
});

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    selectLabel(state, action: PayloadAction<string>) {
      state.selectedLabel = action.payload;
    },
    deselectLabel(state) {
      state.selectedLabel = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLabels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLabels.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.status = 'succeeded';
        state.labels = action.payload;
      })
      .addCase(fetchLabels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch labels';
      })
      .addCase(fetchTopics.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTopics.fulfilled, (state, action: PayloadAction<TopicResponse[]>) => {
        state.status = 'succeeded';
        const pinnedTopics: Topic[] = [];
        const recentTopics: Topic[] = [];
        action.payload.forEach((topic) => {
          const label = topic.ChatAttributes.Label;
          if (!state.topics[label]) {
            state.topics[label] = [];
          }
          const topicObj: Topic = {
            requestId: topic.RequestId,
            topic: topic.Topic,
            label: topic.ChatAttributes.Label,
          };
          state.topics[label].push(topicObj);

          // Add to recent topics
          recentTopics.push(topicObj);

          // Add to pinned topics if IsPinned is true
          if (topic.ChatAttributes.IsPinned === 'true') {
            pinnedTopics.push(topicObj);
          }
        });
        state.recentTopics = recentTopics;
        state.pinnedTopics = pinnedTopics;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch topics';
      });
  },
});

export const { selectLabel, deselectLabel } = sidebarSlice.actions;

export default sidebarSlice.reducer;
