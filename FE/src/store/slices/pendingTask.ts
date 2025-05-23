import { TaskStatusType } from "@/types/GeneratorResponse";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TaskInfo {
  taskId: string;
  status: TaskStatusType;
  type: string;
  createdAt: number;
}
interface PendingTasks {
  [key: string]: TaskInfo;
}
export const PendingTaskSlice = createSlice({
    name: 'pendingTasks',
    initialState: {} as PendingTasks,
    reducers: {
        addTask: (state, action: PayloadAction<TaskInfo>) => {
            const { taskId, status, type, createdAt } = action.payload;
            state[taskId] = { taskId, status, type, createdAt };
        },
        updateTaskStatus: (state, action: PayloadAction<{ taskId: string; status: TaskStatusType }>) => {
            const { taskId, status } = action.payload;
            if (state[taskId]) {
                state[taskId].status = status;
            }
        },
        removeTask: (state, action: PayloadAction<string>) => {
            delete state[action.payload];
        }

    }
});
export const { addTask, updateTaskStatus, removeTask } = PendingTaskSlice.actions;
export default PendingTaskSlice.reducer;