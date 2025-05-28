
  
  // 文生视频创建任务请求体
  export interface TextToVideoRequest {
    model_name?: 'kling-v1' | 'kling-v1-6' | 'kling-v2-master'; // 模型名称（可选，默认kling-v1）
    prompt: string; // 正向提示词（必填，≤2500字）
    negative_prompt?: string; // 负向提示词（可选，≤2500字）
    cfg_scale?: number; // 自由度（0~1，默认0.5）
    mode?: 'std' | 'pro'; // 生成模式（可选，默认std）
    aspect_ratio?: '16:9' | '9:16' | '1:1'; // 画面比例（可选，默认16:9）
    duration?: '5' | '10'; // 视频时长（可选，默认5s）
  }

// 文生视频查询任务（单个）响应体
export  interface QueryText2VideoSingleResponse {
    code: number; // 错误码；具体定义见错误码
    message: string; // 错误信息
    request_id: string; // 请求ID，系统生成，用于跟踪请求、排查问题
    data: DataType;
  }
  
  interface TaskInfo {
    external_task_id?: string; // 客户自定义任务ID（可选，未自定义时为空）
  }
  
  interface TaskResult {
    videos: VideoItem[];
  }
  
  interface VideoItem {
    id: string; // 生成的视频ID，全局唯一
    url: string; // 视频URL（30天后清理，请及时转存）
    duration: string; // 视频时长（单位：s）
  }

// 文生视频查询任务（列表）响应体
export interface QueryText2VideoListResponse {
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
  interface DataType{
    task:Task;
    request:TextToVideoRequest;
    result:Text2VideoTaskItem;
  }

  interface Text2VideoTaskItem {
    task_id: string; // 任务ID，系统生成
    task_status: "submitted" | "processing" | "succeed" | "failed"; // 任务状态
    task_status_msg: string; // 任务状态信息，失败时展示原因
    task_info: TaskInfo; // 任务创建时的参数信息
    task_result?: TaskResult; // 任务结果（可选，处理中或失败时可能无结果）
    created_at: string;
    updated_at: string;
  }
  
  // 复用单个任务中的 TaskInfo 和 TaskResult 接口，避免重复定义