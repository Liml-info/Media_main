
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommonHistoryItem } from './ImageGenerationSlice';


interface MultiImageToHistoryItem extends CommonHistoryItem {
  prompt: string;
  negativePrompt: string;
}

 interface MultiImageToHistoryState {
  MultiImageToVideoHistory: MultiImageToHistoryItem[];
}

const initialState: MultiImageToHistoryState = {
  MultiImageToVideoHistory: [],
};

// 创建Slice
const MultiImageToHistorySlice = createSlice({
  name: 'MultiImageTo',
  initialState,
  reducers: {
    // 图像生成历史加载成功
    fetchSuccessMultiImageTo: (state, action: PayloadAction<MultiImageToHistoryItem[]>) => {
      state.MultiImageToVideoHistory = action.payload;
    },
    // 清空历史记录
    clearMultiImageTo: (state) => {
      state.MultiImageToVideoHistory = [];
    }
  },
});

// 导出Action Creator和Reducer
export const { 
  fetchSuccessMultiImageTo,
  clearMultiImageTo,
} = MultiImageToHistorySlice.actions;

export default MultiImageToHistorySlice.reducer;