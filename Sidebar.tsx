// sidebarSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store'; // Make sure this path matches your project structure

// Define the types for your state
interface Topic {
  requestId: string;
  topic: string;
  label: string;
  isPinned: string;
  isArchived: string;
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

interface RenameLabelResponse {
  oldLabel: string;
  newLabel: string;
}

interface SidebarState {
  crewId: string | null;
  email: string | null;
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
  crewId: null,
  email: null,
  labels: [],
  topics: {},
  recentTopics: [],
  pinnedTopics: [],
  selectedLabel: null,
  status: 'idle',
  error: null,
};

// Async thunk to fetch labels
export const fetchLabels = createAsyncThunk<string[], void, { state: RootState }>(
  'sidebar/fetchLabels',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const { crewId } = state.sidebar;
    if (!crewId) {
      return rejectWithValue('CrewId is not set');
    }
    try {
      const response = await axios.get<LabelResponse>(`/api/retrieveProfile?crewId=${crewId}`);
      return response.data.Labels;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to fetch topics
export const fetchTopics = createAsyncThunk<TopicResponse[], void, { state: RootState }>(
  'sidebar/fetchTopics',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const { crewId } = state.sidebar;
    if (!crewId) {
      return rejectWithValue('CrewId is not set');
    }
    try {
      const response = await axios.get<TopicResponse[]>(`/api/getHistory?crewId=${crewId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to rename label
export const renameLabel = createAsyncThunk<RenameLabelResponse, { oldLabel: string; newLabel: string }>(
  'sidebar/renameLabel',
  async ({ oldLabel, newLabel }, { rejectWithValue }) => {
    try {
      const response = await axios.put<RenameLabelResponse>(`/api/renameLabel`, { oldLabel, newLabel });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update topic label
export const updateTopicLabel = createAsyncThunk<void, { requestId: string; newLabel: string }, { state: RootState }>(
  'sidebar/updateTopicLabel',
  async ({ requestId, newLabel }, { getState, rejectWithValue }) => {
    const state = getState();
    const { crewId } = state.sidebar;
    const topic = Object.values(state.sidebar.topics).flat().find(topic => topic.requestId === requestId);

    if (!crewId) {
      return rejectWithValue('CrewId is not set');
    }

    if (!topic) {
      return rejectWithValue('Topic not found');
    }

    const { topic: topicText, isPinned, isArchived } = topic;

    try {
      await axios.put(`/api/updateTopicLabel`, {
        CrewId: crewId,
        RequestId: requestId,
        Topic: topicText,
        ChatAttributes: {
          Label: newLabel,
          IsPinned: isPinned,
          IsArchived: isArchived
        }
      });
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update pin status
export const updatePinStatus = createAsyncThunk<void, { requestId: string }, { state: RootState }>(
  'sidebar/updatePinStatus',
  async ({ requestId }, { getState, rejectWithValue }) => {
    const state = getState();
    const { crewId } = state.sidebar;
    const topic = Object.values(state.sidebar.topics).flat().find(topic => topic.requestId === requestId);

    if (!crewId) {
      return rejectWithValue('CrewId is not set');
    }

    if (!topic) {
      return rejectWithValue('Topic not found');
    }

    const { topic: topicText, label, isArchived } = topic;

    try {
      await axios.put(`/api/updatePinStatus`, {
        CrewId: crewId,
        RequestId: requestId,
        Topic: topicText,
        ChatAttributes: {
          Label: label,
          IsPinned: "True",
          IsArchived: isArchived
        }
      });
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setCrewId(state, action: PayloadAction<string>) {
      state.crewId = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
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
            isPinned: topic.ChatAttributes.IsPinned,
            isArchived: topic.ChatAttributes.IsArchived,
          };
          state.topics[label].push(topicObj);

          // Add to recent topics
          recentTopics.push(topicObj);

          // Add to pinned topics if IsPinned is true
          if (topic.ChatAttributes.IsPinned === 'True') {
            pinnedTopics.push(topicObj);
          }
        });
        state.recentTopics = recentTopics;
        state.pinnedTopics = pinnedTopics;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch topics';
      })
      .addCase(renameLabel.fulfilled, (state, action: PayloadAction<RenameLabelResponse>) => {
        const { oldLabel, newLabel } = action.payload;
        state.labels = state.labels.map(label => label === oldLabel ? newLabel : label);
        state.topics[newLabel] = state.topics[oldLabel];
        delete state.topics[oldLabel];
        if (state.selectedLabel === oldLabel) {
          state.selectedLabel = newLabel;
        }
      })
      .addCase(updateTopicLabel.fulfilled, (state, action: PayloadAction<{ requestId: string; newLabel: string }>) => {
        const { requestId, newLabel } = action.payload;
        Object.keys(state.topics).forEach(label => {
          state.topics[label] = state.topics[label].filter(topic => {
            if (topic.requestId === requestId) {
              topic.label = newLabel;
              return false;
            }
            return true;
          });
        });
        if (!state.topics[newLabel]) {
          state.topics[newLabel] = [];
        }
        state.topics[newLabel].push({
          requestId,
          topic: state.topics[newLabel].find(topic => topic.requestId === requestId)?.topic || '',
          label: new
