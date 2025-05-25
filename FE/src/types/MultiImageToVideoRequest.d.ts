
// 单张参考图片配置
interface ImageItem {
    image: string; // 图片URL或Base64编码（无data前缀）
  }
  
  // 多图参考生视频请求体
  export interface MultiImageToVideoRequest {
    model_name?: 'kling-v1-6'; // 模型名称（可选，默认kling-v1-6）
    image_list: ImageItem[]; // 必填，最多4张图片
    prompt?: string; // 正向提示词（可选，≤2500字）
    negative_prompt?: string; // 负向提示词（可选，≤2500字）
    mode?: 'std' | 'pro'; // 生成模式（可选，默认std）
    duration?: '5' | '10'; // 视频时长（可选，默认5s）
    aspect_ratio?: '16:9' | '9:16' | '1:1'; // 画面比例（可选，默认16:9）
  }


 export interface QueryMultiImage2VideoSingleResponse {
    code: number; // 错误码（0为成功，非0为异常）
    message: string; // 错误信息（成功时为空）
    request_id: string; // 请求ID（用于问题排查）
    data: DataType; // 任务详情数据
  }
  
  interface TaskInfo {
    external_task_id?: string; // 客户自定义任务ID（可选，未设置时为空）
    image_urls: string[]; // 输入图片URL列表（多张图片）
    // 可根据实际需求扩展其他参数（如视频时长、转场效果等）
  }
  
  interface TaskResult {
    videos: VideoItem[]; // 生成的视频列表
  }
  
  interface VideoItem {
    id: string; // 视频ID（全局唯一）
    url: string; // 视频URL（30天后过期，需及时转存）
    duration: string; // 视频时长（单位：秒，如"15"、"30"）
  }

export  interface QueryMultiImage2VideoListResponse {
    code: number; // 错误码
    message: string; // 错误信息
    request_id: string; // 请求ID
    data: DataType[]; // 任务列表数据
  }
  

  
  
  interface DataType{
    request:MultiImageToVideoRequest;
    response:MultiImage2VideoTaskItem;
  }

  interface MultiImage2VideoTaskItem {
    task_id: string; // 任务ID
    task_status: "submitted" | "processing" | "succeed" | "failed"; // 任务状态
    task_status_msg: string; // 状态描述
    task_info: TaskInfo; // 任务创建参数
    task_result?: TaskResult; // 任务结果（可选）
    created_at: number; // 创建时间
    updated_at: number; // 更新时间
  }
  
  // 复用单个任务中的 TaskInfo、TaskResult、VideoItem 接口，避免重复定义