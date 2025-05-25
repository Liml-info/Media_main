
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommonHistoryItem } from './ImageGenerationSlice';


interface ImageToVideoHistoryItem extends CommonHistoryItem {
  prompt: string;
  negativePrompt: string;
}

 interface ImageToVideoHistoryState {
  imageToVideoHistory: ImageToVideoHistoryItem[];
}

const initialState: ImageToVideoHistoryState = {
  imageToVideoHistory: [],
};

// 创建Slice
const ImageToVideoHistorySlice = createSlice({
  name: 'ImageToVideo',
  initialState,
  reducers: {
    // 图像生成历史加载成功
    fetchSuccessImageToVideo: (state, action: PayloadAction<ImageToVideoHistoryItem[]>) => {
      state.imageToVideoHistory = action.payload;
    },
    // 清空历史记录
    clearImageToVideo: (state) => {
      state.imageToVideoHistory = [];
    }
  },
});

// 导出Action Creator和Reducer
export const { 
  fetchSuccessImageToVideo,
  clearImageToVideo,
} = ImageToVideoHistorySlice.actions;

export default ImageToVideoHistorySlice.reducer;