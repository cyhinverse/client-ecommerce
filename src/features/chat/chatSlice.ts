import { createSlice } from "@reduxjs/toolkit";

interface ChatState {
  isOpen: boolean;
}

const initialState: ChatState = {
  isOpen: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    setChatOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const { toggleChat, setChatOpen } = chatSlice.actions;
export default chatSlice.reducer;
