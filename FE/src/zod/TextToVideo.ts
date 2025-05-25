import { z } from 'zod';


// 文生视频创建任务请求体
export const TextToVideoRequestSchema = z.object({
  model_name: z.enum(['kling-v1', 'kling-v1-6', 'kling-v2-master']).optional(),
  prompt: z.string().nonempty('正向提示词不能为空').max(2500, '正向提示词长度不能超过2500字'),
  negative_prompt: z.string().max(2500, '负向提示词长度不能超过2500字').optional(),
  cfg_scale: z.number().min(0).max(1).optional(),
  mode: z.enum(['std', 'pro']).optional(),
  aspect_ratio: z.enum(['16:9', '9:16', '1:1']).optional(),
  duration: z.enum(['5', '10']).optional()
});

// 自定义错误信息映射
export const TextToVideoValidationErrorMap: z.ZodErrorMap = (issue, ctx) => {
  const errorMessages: Record<string, string> = {
    'model_name': '无效的模型名称，可选值为kling-v1、kling-v1-6、kling-v2-master',
    'prompt': '正向提示词为必填项，且长度不能超过2500字',
    'negative_prompt': '负向提示词长度不能超过2500字',
    'cfg_scale': '自由度必须在0~1之间',
    'mode': '无效的生成模式，可选值为std、pro',
    'camera_control.type': '无效的运镜类型',
    'aspect_ratio': '无效的画面比例，可选值为16:9、9:16、1:1',
    'duration': '无效的视频时长，可选值为5或10'
  };

  if (issue.path.length > 0) {
    const pathKey = issue.path.join('.');
    if (errorMessages[pathKey]) {
      return { message: errorMessages[pathKey] };
    }
  }

  // 针对simple模式的特殊错误提示
  if (issue.code === z.ZodIssueCode.custom) {
    return { message: 'simple模式必须配置config参数' };
  }

  // 默认错误信息
  return { message: ctx.defaultError };
};