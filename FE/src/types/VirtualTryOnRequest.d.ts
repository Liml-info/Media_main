
// 虚拟试穿请求体
export interface VirtualTryOnRequest {
    model_name?: TryOnModelType; // 模型名称（可选，默认v1）
    human_image: string; // 必填，人物图片（Base64或URL，无data前缀）
    cloth_image: string; // 必填，服饰图片（Base64或URL，无data前缀）
  }

export type TryOnModelType = 'kolors-virtual-try-on-v1' | 'kolors-virtual-try-on-v1-5';

//------------查询任务（单个）
interface QueryTaskSingleResponse {
  code: number; // 错误码；具体定义见错误码
  message: string; // 错误信息
  request_id: string; // 请求ID，系统生成，用于跟踪请求、排查问题
  data: DataType;
}


//------------查询任务（列表）
interface QueryTaskListResponse {
  code: number; // 错误码；具体定义见错误码
  message: string; // 错误信息
  request_id: string; // 请求ID，系统生成，用于跟踪请求、排查问题
  data: DataType[];
}
interface Task {
  task_id: string;
  user_id: string;
  task_type: string;
  status: string;
  status_msg: string;
  created_at: string;
  updated_at: string;
}

interface DataType {
  task:Task;
  request:VirtualTryOnRequest; // 请求参数
  result:TaskSingleData; // 响应参数
}

interface TaskListData {
  total: number; // 任务总数
  page: number; // 当前页码（从1开始）
  page_size: number; // 每页显示数量
  tasks: TaskSingleData[]; // 任务列表
}

//------------公用部分


interface TaskSingleData {
  task_id: string; // 任务ID，系统生成
  task_status: TaskStatusType; // 任务状态
  task_status_msg: string; // 任务状态信息，当任务失败时展示失败原因（如触发平台的内容风控等）
  created_at: string;
  updated_at: string;
  task_result: TaskResult;
}

interface TaskResult {
  images: ImageItem[];
}

interface ImageItem {
  index: number; // 图片编号
  url: string; // 生成图片的URL（请注意，为保障信息安全，生成的图片/视频会在30天后被清理，请及时转存）
}