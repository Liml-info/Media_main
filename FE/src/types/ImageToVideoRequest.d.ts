// 运动轨迹坐标
interface TrajectoryPoint {
    x: number; // 横坐标（像素，原点为图片左下角）
    y: number; // 纵坐标（像素，原点为图片左下角）
  }
  
  // 动态笔刷配置
  interface DynamicMask {
    mask: string; // 动态笔刷遮罩图片（Base64或URL）
    trajectories: TrajectoryPoint[]; // 运动轨迹坐标序列（长度[2, 77]）
  }
  
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
    type?: 'simple' | 'down_back' | 'forward_up' | 'right_turn_forward' | 'left_turn_forward'; // 运镜类型
    config?: CameraControlConfig; // 仅simple模式需要配置
  }
  
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
    dynamic_masks?: DynamicMask[]; // 动态笔刷配置（可选，最多6组）
    camera_control?: CameraControl; // 运镜控制（可选）
    aspect_ratio?: '16:9' | '9:16' | '1:1'; // 画面比例（可选，默认16:9）
    duration?: '5' | '10'; // 视频时长（可选，默认5s）
  }