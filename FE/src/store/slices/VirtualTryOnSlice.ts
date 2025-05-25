
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommonHistoryItem } from './ImageGenerationSlice';


export interface VirtualTryOnHistoryItem extends CommonHistoryItem {
}

 interface VirtualTryOnHistoryState {
  virtualTryOnHistory: VirtualTryOnHistoryItem[];
}

const initialState: VirtualTryOnHistoryState = {
  virtualTryOnHistory: [],
};

// 创建Slice
const VirtualTryOnHistorySlice = createSlice({
  name: 'VirtualTryOn',
  initialState,
  reducers: {
    // 图像生成历史加载成功
    fetchSuccessVirtualTryOn: (state, action: PayloadAction<VirtualTryOnHistoryItem[]>) => {
      state.virtualTryOnHistory = action.payload;
    },
    // 清空历史记录
    clearVirtualTryOn: (state) => {
      state.virtualTryOnHistory = [];
    }
  },
});

// 导出Action Creator和Reducer
export const { 
  fetchSuccessVirtualTryOn,
  clearVirtualTryOn,
} = VirtualTryOnHistorySlice.actions;

export default VirtualTryOnHistorySlice.reducer;