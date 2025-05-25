
// 图生视频创建任务请求体
  export interface ImageToVideoRequest {
    model_name?: 'kling-v1' | 'kling-v1-5' | 'kling-v1-6' | 'kling-v2-master'; // 模型名称（可选，默认kling-v1）
    image: string; // 参考图像（必填，Base64或URL，无data前缀）
    image_tail?: string; // 尾帧图像（可选，Base64或URL，与image二选一）
    prompt?: string; // 正向提示词（可选，≤2500字）
    negative_prompt?: string; // 负向提示词（可选，≤2500字）
    cfg_scale?: number; // 自由度（0~1，默认0.5）
    mode?: 'std' | 'pro'; // 生成模式（可选，默认std）
    aspect_ratio?: '16:9' | '9:16' | '1:1'; // 画面比例（可选，默认16:9）
    duration?: '5' | '10'; // 视频时长（可选，默认5s）
  }

  // 图生视频查询任务（单个）响应体
export  interface QueryImage2VideoSingleResponse {
    code: number; // 错误码（0为成功，非0为异常）
    message: string; // 错误信息（成功时为空）
    request_id: string; // 请求ID（用于问题排查）
    data: DataType; // 任务详情数据
  }

  interface TaskInfo {
    external_task_id?: string; // 客户自定义任务ID（可选，未设置时为空）
    // 可根据实际需求扩展其他参数（如图片URL、视频配置等）
  }
  
  interface TaskResult {
    videos: VideoItem[]; // 生成的视频列表
  }
  
  interface VideoItem {
    id: string; // 视频ID（全局唯一）
    url: string; // 视频URL（30天后过期，需及时转存）
    duration: string; // 视频时长（单位：秒，如"5"、"10"）
  }
// 图生视频查询任务（列表）响应体
export interface QueryImage2VideoListResponse {
    code: number; // 错误码
    message: string; // 错误信息
    request_id: string; // 请求ID
    data: DataType[]; // 任务列表数据
  }
  

  
  interface DataType{
    request:ImageToVideoRequest;
    response:Image2VideoTaskItem;
  }
  
  interface Image2VideoTaskItem {
    task_id: string; // 任务ID
    task_status: "submitted" | "processing" | "succeed" | "failed"; // 任务状态
    task_status_msg: string; // 状态描述
    task_info: TaskInfo; // 任务创建参数
    task_result?: TaskResult; // 任务结果（可选）
    created_at: number; // 创建时间
    updated_at: number; // 更新时间
  }
  
  // 复用单个任务中的 TaskInfo、TaskResult、VideoItem 接口，避免重复定义