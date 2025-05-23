import { z } from 'zod';

// 单张参考图片配置
const ImageItemSchema = z.object({
  image: z.string().nonempty().describe('图片URL或Base64编码不能为空')
});

// 多图参考生视频请求体
export const MultiImageToVideoRequestSchema = z.object({
  model_name: z.literal('kling-v1-6').optional(),
  image_list: z.array(ImageItemSchema)
    .min(1, '至少需要提供1张参考图片')
    .max(4, '参考图片数量不能超过4张'),
  prompt: z.string().max(2500, '正向提示词长度不能超过2500字').optional(),
  negative_prompt: z.string().max(2500, '负向提示词长度不能超过2500字').optional(),
  mode: z.enum(['std', 'pro']).optional(),
  duration: z.enum(['5', '10']).optional(),
  aspect_ratio: z.enum(['16:9', '9:16', '1:1']).optional()
});

// 自定义错误信息映射
export const validationErrorMap: z.ZodErrorMap = (issue, ctx) => {
  const errorMessages: Record<string, string> = {
    'model_name': '无效的模型名称，当前仅支持kling-v1-6',
    'image_list': '参考图片数量必须在1-4张之间',
    'prompt': '正向提示词长度不能超过2500字',
    'negative_prompt': '负向提示词长度不能超过2500字',
    'mode': '无效的生成模式，可选值为std、pro',
    'duration': '无效的视频时长，可选值为5或10',
    'aspect_ratio': '无效的画面比例，可选值为16:9、9:16、1:1'
  };

  if (issue.path.length > 0) {
    const pathKey = issue.path.join('.');
    if (errorMessages[pathKey]) {
      return { message: errorMessages[pathKey] };
    }
  }

  return { message: ctx.defaultError };
};
//MultiImageToVideoRequestSchema.safeParse(requestBody, { errorMap: validationErrorMap });