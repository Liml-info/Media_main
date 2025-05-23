import { configureStore } from '@reduxjs/toolkit';
import historyReducer from './slices/historySlice';
import pendingTaskReducer from './slices/pendingTask';


// 配置根Store
export const store = configureStore({
  reducer: {
    history: historyReducer, // 新增历史记录Reducer
    pendingTasks: pendingTaskReducer, // 新增PendingTaskReducer
  },
  devTools: true,
});

// 类型导出（用于类型提示）
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;