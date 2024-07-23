export const regenerateChatData = createAsyncThunk<ChatMessage, { crewId: string, requestId: string, responseId: string, newMessage: string }>(
    'mainChat/regenerateChatData',
    async ({ crewId, requestId, responseId, newMessage }) => {
      // API call to regenerate the response
      const response = await axios.post('/api/regenerate', {
        CrewId: crewId,
        RequestId: requestId,
        ResponseId: responseId,
        Message: newMessage,
      });
  
      const newChat: ChatMessage = {
        message: newMessage,
        response: response.data.response, // Use the response from the API
        responseId: responseId,
        timestamp: new Date().toISOString(),
        report: "Sample report",
        reaction: "Sample reaction",
      };
  
      return newChat;
    }
  );


  .addCase(regenerateChatData.fulfilled, (state, action: PayloadAction<ChatMessage>) => {
    state.status = 'succeeded';
    state.conversations.push(action.payload); // Add new response as a new entry
  });