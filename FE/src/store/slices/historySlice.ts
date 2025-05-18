import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HistoryItem {
    id: string;
    src: string | string[];
    thumbnailSrc?: string;
  }
  interface VirtualTryOnHistoryItem extends HistoryItem  {
    
  }
  interface ImageGenerationHistoryItem extends HistoryItem {
    prompt: string;
    negativePrompt: string;
  }
  interface Image2VideoHistoryItem extends HistoryItem {
    prompt: string;
    negativePrompt: string;
  }
  interface Text2VideoHistoryItem extends HistoryItem {
    prompt: string;
  }

// 定义状态类型（与原Context保持一致）
 interface HistoryState {
  virtualTryOnHistory: VirtualTryOnHistoryItem[];
  imageGenerationHistory: ImageGenerationHistoryItem[];
  image2VideoHistory: Image2VideoHistoryItem[];
  text2VideoHistory: Text2VideoHistoryItem[];
  loading: boolean;
  error: string | null;
}

// 初始状态（与原Context保持一致）
const initialState: HistoryState = {
  virtualTryOnHistory: [],
  imageGenerationHistory: [],
  image2VideoHistory: [],
  text2VideoHistory: [],
  loading: true,
  error: null,
};

// 创建Slice
const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    // 开始加载
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // 虚拟试穿历史加载成功
    fetchSuccessVirtualTryOn: (state, action: PayloadAction<VirtualTryOnHistoryItem[]>) => {
      state.virtualTryOnHistory = action.payload;
      state.loading = false;
    },
    // 图像生成历史加载成功
    fetchSuccessImageGeneration: (state, action: PayloadAction<ImageGenerationHistoryItem[]>) => {
      state.imageGenerationHistory = action.payload;
      state.loading = false;
    },
    // 图片转视频历史加载成功
    fetchSuccessImage2Video: (state, action: PayloadAction<Image2VideoHistoryItem[]>) => {
      state.image2VideoHistory = action.payload;
      state.loading = false;
    },
    // 文本转视频历史加载成功
    fetchSuccessText2Video: (state, action: PayloadAction<Text2VideoHistoryItem[]>) => {
      state.text2VideoHistory = action.payload;
      state.loading = false;
    },
    // 加载失败
    fetchError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // 清空历史记录
    clearHistory: (state) => {
      state.virtualTryOnHistory = [];
      state.imageGenerationHistory = [];
      state.image2VideoHistory = [];
      state.text2VideoHistory = [];
    }
  },
});

// 导出Action Creator和Reducer
export const { 
  fetchStart,
  fetchSuccessVirtualTryOn,
  fetchSuccessImageGeneration,
  fetchSuccessImage2Video,
  fetchSuccessText2Video,
  fetchError ,
  clearHistory,
} = historySlice.actions;

export default historySlice.reducer;