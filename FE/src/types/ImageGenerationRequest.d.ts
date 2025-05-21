
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