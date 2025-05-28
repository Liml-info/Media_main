import { combineReducers,configureStore } from '@reduxjs/toolkit';
import ImageGenerationReducer from './slices/ImageGenerationSlice';
import ImageToVideoReducer from './slices/ImageToVideoSlice';
import MultiImageToVideoReducer from './slices/MultiImageToVideoSlice';
import TextToVideoReducer from './slices/TextToVideoSlice';
import VirtualTryOnReducer from './slices/VirtualTryOnSlice';


// 配置根Store
export const store = configureStore({
  reducer: {
    ImageGeneration:ImageGenerationReducer,
    ImageToVideo:ImageToVideoReducer,
    MultiImageToVideo:MultiImageToVideoReducer,
    TextToVideo:TextToVideoReducer,
    VirtualTryOn:VirtualTryOnReducer,
  },
  devTools: true,
});

// 类型导出（用于类型提示）
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;