.addCase(updatePinStatus.fulfilled, (state, action: PayloadAction<{ requestId: string, label: string, topicText: string, isArchived: string }>) => {
    const { requestId, label, topicText, isArchived } = action.payload;
    // Find and update the topic's isPinned status
    const topicIndex = state.topics[label].findIndex(topic => topic.requestId === requestId);
    if (topicIndex > -1) {
      state.topics[label][topicIndex].isPinned = 'True';
      // Add the topic to the pinnedTopics list
      const pinnedTopic = state.topics[label][topicIndex];
      state.pinnedTopics.push(pinnedTopic);
    }
  })
  