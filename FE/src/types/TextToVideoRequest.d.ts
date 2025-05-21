// 摄像机控制 - 运镜配置（simple模式专用）
interface CameraControlConfig {
    horizontal?: number; // 水平平移（-10~10）
    vertical?: number; // 垂直平移（-10~10）
    pan?: number; // 水平摇镜（-10~10）
    tilt?: number; // 垂直摇镜（-10~10）
    roll?: number; // 旋转运镜（-10~10）
    zoom?: number; // 变焦（-10~10）
  }
  
  // 摄像机控制协议
  interface CameraControl {
    type?: 'simple' | 'down_back' | 'forward_up' 
          | 'right_turn_forward' | 'left_turn_forward'; // 运镜类型
    config?: CameraControlConfig; // 仅simple模式需要配置
  }
  
  // 文生视频创建任务请求体
  export interface TextToVideoRequest {
    model_name?: 'kling-v1' | 'kling-v1-6' | 'kling-v2-master'; // 模型名称（可选，默认kling-v1）
    prompt: string; // 正向提示词（必填，≤2500字）
    negative_prompt?: string; // 负向提示词（可选，≤2500字）
    cfg_scale?: number; // 自由度（0~1，默认0.5）
    mode?: 'std' | 'pro'; // 生成模式（可选，默认std）
    camera_control?: CameraControl; // 运镜控制（可选）
    aspect_ratio?: '16:9' | '9:16' | '1:1'; // 画面比例（可选，默认16:9）
    duration?: '5' | '10'; // 视频时长（可选，默认5s）
  }