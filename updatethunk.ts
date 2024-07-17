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