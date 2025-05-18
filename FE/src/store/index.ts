import { configureStore } from '@reduxjs/toolkit';
import historyReducer from './slices/historySlice';


// 配置根Store
export const store = configureStore({
  reducer: {
    history: historyReducer, // 新增历史记录Reducer
    // 其他已有的Reducer（如果有）
  },
  devTools: true,
});

// 类型导出（用于类型提示）
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;