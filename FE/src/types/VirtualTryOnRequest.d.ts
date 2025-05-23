
// 虚拟试穿请求体
export interface VirtualTryOnRequest {
    model_name?: TryOnModelType; // 模型名称（可选，默认v1）
    human_image: string; // 必填，人物图片（Base64或URL，无data前缀）
    cloth_image: string; // 必填，服饰图片（Base64或URL，无data前缀）
  }

export type TryOnModelType = 'kolors-virtual-try-on-v1' | 'kolors-virtual-try-on-v1-5';