import { TaskStatusType } from '@/types/Common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface videoItem {
  id: string; // 生成的视频ID，全局唯一
  url: string; // 视频URL（30天后清理，请及时转存）
  duration: string; // 视频时长（单位：s）
}
interface ImageItem {
  index: number; // 图片索引（从1开始）
  url: string; // 图片URL或Base64编码（无data前缀）
}




export interface CommonHistoryItem {
    id: string;
    src: videoItem[] | ImageItem[];
    thumbnailSrc?: string;
    created_at?: string;
    task_status?:TaskStatusType;
}


export interface ImageGenerationHistoryItem extends CommonHistoryItem {
  prompt: string;
  negativePrompt?: string;
}

 interface ImageGenerationHistoryState {
  imageGenerationHistory: ImageGenerationHistoryItem[];
}

const initialState: ImageGenerationHistoryState = {
  imageGenerationHistory: [],
};

// 创建Slice
const ImageGenerationHistorySlice = createSlice({
  name: 'ImageGeneration',
  initialState,
  reducers: {
    // 图像生成历史加载成功
    fetchSuccessImageGeneration: (state, action: PayloadAction<ImageGenerationHistoryItem[]>) => {
      state.imageGenerationHistory = action.payload;
    },
    // 清空历史记录
    clearImageGeneration: (state) => {
      state.imageGenerationHistory = [];
    }
  },
});

// 导出Action Creator和Reducer
export const { 
  fetchSuccessImageGeneration,
  clearImageGeneration,
} = ImageGenerationHistorySlice.actions;

export default ImageGenerationHistorySlice.reducer;