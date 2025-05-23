
// 图生视频创建任务请求体
  export interface ImageToVideoRequest {
    model_name?: 'kling-v1' | 'kling-v1-5' | 'kling-v1-6' | 'kling-v2-master'; // 模型名称（可选，默认kling-v1）
    image: string; // 参考图像（必填，Base64或URL，无data前缀）
    image_tail?: string; // 尾帧图像（可选，Base64或URL，与image二选一）
    prompt?: string; // 正向提示词（可选，≤2500字）
    negative_prompt?: string; // 负向提示词（可选，≤2500字）
    cfg_scale?: number; // 自由度（0~1，默认0.5）
    mode?: 'std' | 'pro'; // 生成模式（可选，默认std）
    static_mask?: string; // 静态笔刷遮罩（可选，需与image长宽比一致）
    aspect_ratio?: '16:9' | '9:16' | '1:1'; // 画面比例（可选，默认16:9）
    duration?: '5' | '10'; // 视频时长（可选，默认5s）
  }