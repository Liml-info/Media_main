
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommonHistoryItem } from './ImageGenerationSlice';


export interface MultiImageToVideoHistoryItem extends CommonHistoryItem {
  prompt: string;
  negativePrompt: string;
}

 interface MultiImageToVideoHistoryState {
  MultiImageToVideoHistory: MultiImageToVideoHistoryItem[];
}

const initialState: MultiImageToVideoHistoryState = {
  MultiImageToVideoHistory: [],
};

// 创建Slice
const MultiImageToVideoHistorySlice = createSlice({
  name: 'MultiImageTo',
  initialState,
  reducers: {
    // 图像生成历史加载成功
    fetchSuccessMultiImageToVideo: (state, action: PayloadAction<MultiImageToVideoHistoryItem[]>) => {
      state.MultiImageToVideoHistory = action.payload;
    },
    // 清空历史记录
    clearMultiImageToVideo: (state) => {
      state.MultiImageToVideoHistory = [];
    }
  },
});

// 导出Action Creator和Reducer
export const { 
  fetchSuccessMultiImageToVideo,
  clearMultiImageToVideo,
} = MultiImageToVideoHistorySlice.actions;

export default MultiImageToVideoHistorySlice.reducer;