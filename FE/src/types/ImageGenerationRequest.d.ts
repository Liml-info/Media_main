
// 图像生成请求体
export interface ImageGenerationRequest {
    model_name?: 'kling-v1' | 'kling-v1-5' | 'kling-v2'; // 模型名称（可选，默认kling-v1）
    prompt: string; // 正向提示词（必填，≤2500字）
    negative_prompt?: string; // 负向提示词（可选，≤2500字，图生图时无效）
    image?: string; // 参考图像（可选，Base64或URL，无data前缀）
    image_reference?: 'subject' | 'face'; // 图片参考类型（仅kling-v1-5支持）
    image_fidelity?: number; // 图像参考强度（0~1，默认0.5）
    human_fidelity?: number; // 面部参考强度（0~1，默认0.45，仅subject模式生效）
    n?: number; // 生成数量（1~9，默认1）
    aspect_ratio?: '16:9' | '9:16' | '1:1' | '4:3' | '3:4' | '3:2' | '2:3' | '21:9'; // 画面比例（可选，默认16:9）
  }

  export interface QueryImageGenerationSingleResponse {
    code: number; // 错误码（0为成功，非0为异常）
    message: string; // 错误信息（成功时为空）
    request_id: string; // 请求ID（用于问题排查）
    data: DataType; // 任务详情数据
  }
  
  
  interface TaskInfo {
    external_task_id?: string; // 客户自定义任务ID（可选，未设置时为空）
    // 可根据实际需求扩展参数（如prompt、图像尺寸、数量等）
    prompt: string; // 生成图像的文本描述
    image_num?: number; // 生成图像数量（默认1）
    image_size?: "256x256" | "512x512" | "1024x1024"; // 图像尺寸
  }
  
  interface TaskResult {
    images: ImageItem[]; // 生成的图像列表
  }
  
  interface ImageItem {
    index: number; // 图片编号（从0开始）
    url: string; // 图片URL（30天后过期，需及时转存）
  }

export  interface QueryImageGenerationListResponse {
    code: number; // 错误码
    message: string; // 错误信息
    request_id: string; // 请求ID
    data: DataType[]; // 任务列表数据
  }
  interface DataType{
    request:ImageGenerationRequest;
    response:ImageGenerationTaskItem;
  }
  
  interface ImageGenerationTaskItem {
    task_id: string; // 任务ID
    task_status: "submitted" | "processing" | "succeed" | "failed"; // 任务状态
    task_status_msg: string; // 状态描述
    task_info: TaskInfo; // 任务创建参数
    task_result?: TaskResult; // 任务结果（可选）
    created_at: number; // 创建时间
    updated_at: number; // 更新时间
  }
  
  // 复用单个任务中的 TaskInfo、TaskResult、ImageItem 接口，避免重复定义