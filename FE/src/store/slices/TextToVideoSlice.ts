
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommonHistoryItem } from './ImageGenerationSlice';


interface TextToVideoHistoryItem extends CommonHistoryItem {
  prompt: string;
}

 interface TextToVideoHistoryState {
  textToVideoHistory: TextToVideoHistoryItem[];
}

const initialState: TextToVideoHistoryState = {
  textToVideoHistory: [],
};

// 创建Slice
const TextToVideoHistorySlice = createSlice({
  name: 'TextToVideo',
  initialState,
  reducers: {
    // 图像生成历史加载成功
    fetchSuccessTextToVideo: (state, action: PayloadAction<TextToVideoHistoryItem[]>) => {
      state.textToVideoHistory = action.payload;
    },
    // 清空历史记录
    clearTextToVideo: (state) => {
      state.textToVideoHistory = [];
    }
  },
});

// 导出Action Creator和Reducer
export const { 
  fetchSuccessTextToVideo,
  clearTextToVideo,
} = TextToVideoHistorySlice.actions;

export default TextToVideoHistorySlice.reducer;