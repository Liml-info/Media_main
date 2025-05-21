import { z } from 'zod';

// 自定义验证器
const base64Regex = /^[A-Za-z0-9+/=]+$/;
const urlOrBase64 = z.string().refine(
  (value) => z.string().url().safeParse(value).success || base64Regex.test(value),
  { message: '必须是有效的URL或Base64字符串' }
);

export const ImageGenerationSchema = z.object({
  model_name: z.enum(['kling-v1', 'kling-v1-5', 'kling-v2']).optional(),
  
  prompt: z.string()
    .min(1, '提示词不能为空')
    .max(2500, '提示词不能超过2500个字符'),
  
  negative_prompt: z.string()
    .max(2500, '负向提示词不能超过2500个字符')
    .optional(),
  
  image: urlOrBase64.optional(),
  
  image_reference: z.enum(['subject', 'face']).optional(),
  
  image_fidelity: z.number()
    .min(0, '图像参考强度必须在0~1之间')
    .max(1, '图像参考强度必须在0~1之间')
    .optional(),
  
  human_fidelity: z.number()
    .min(0, '面部参考强度必须在0~1之间')
    .max(1, '面部参考强度必须在0~1之间')
    .optional(),
  
  n: z.number()
    .int('生成数量必须是整数')
    .min(1, '生成数量至少为1')
    .max(9, '生成数量最多为9')
    .optional(),
  
  aspect_ratio: z.enum([
    '16:9', '9:16', '1:1', '4:3', '3:4', '3:2', '2:3', '21:9'
  ]).optional(),
})
// 交叉验证：model_name为kling-v1-5时，image_reference必须存在
.refine(
  (data) => data.model_name !== 'kling-v1-5' || data.image_reference !== undefined,
  {
    path: ['image_reference'],
    message: '当使用kling-v1-5模型时，必须指定image_reference'
  }
)
// 交叉验证：image_reference为subject时，human_fidelity必须存在
.refine(
  (data) => data.image_reference !== 'subject' || data.human_fidelity !== undefined,
  {
    path: ['human_fidelity'],
    message: '当image_reference为subject时，必须指定human_fidelity'
  }
)
// 交叉验证：有image时，negative_prompt应忽略（不做强制，仅提示）
.refine(
  (data) => data.image === undefined || data.negative_prompt === undefined,
  {
    path: ['negative_prompt'],
    message: '图生图模式下，negative_prompt参数无效'
  }
);