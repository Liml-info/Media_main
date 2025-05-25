import { z } from 'zod';


// 图生视频创建任务请求体
export const ImageToVideoRequestSchema = z.object({
  model_name: z.enum(['kling-v1', 'kling-v1-5', 'kling-v1-6', 'kling-v2-master']).optional(),
  image: z.string().nonempty().describe('参考图像不能为空'),
  image_tail: z.string().optional(),
  prompt: z.string().max(2500, '正向提示词长度不能超过2500字').optional(),
  negative_prompt: z.string().max(2500, '负向提示词长度不能超过2500字').optional(),
  cfg_scale: z.number().min(0).max(1).optional(),
  mode: z.enum(['std', 'pro']).optional(),
  static_mask: z.string().optional(),
  aspect_ratio: z.enum(['16:9', '9:16', '1:1']).optional(),
  duration: z.enum(['5', '10']).optional()
});

// 自定义错误信息映射
export const ImageToVideoValidationErrorMap: z.ZodErrorMap = (issue, ctx) => {
  const errorMessages: Record<string, string> = {
    'model_name': '无效的模型名称，可选值为kling-v1、kling-v1-5、kling-v1-6、kling-v2-master',
    'image': '参考图像为必填项',
    'prompt': '正向提示词长度不能超过2500字',
    'negative_prompt': '负向提示词长度不能超过2500字',
    'cfg_scale': '自由度必须在0~1之间',
    'mode': '无效的生成模式，可选值为std、pro',
    'dynamic_masks': '动态笔刷配置最多支持6组',
    'aspect_ratio': '无效的画面比例，可选值为16:9、9:16、1:1',
    'duration': '无效的视频时长，可选值为5或10'
  };

  if (issue.path.length > 0) {
    const pathKey = issue.path.join('.');
    if (errorMessages[pathKey]) {
      return { message: errorMessages[pathKey] };
    }
  }

  // 默认错误信息
  return { message: ctx.defaultError };
};

//ImageToVideoRequestSchema.safeParse(requestBody, { errorMap: validationErrorMap });