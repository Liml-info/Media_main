
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