import { z } from 'zod';

// カスタムバリデータ
const base64Regex = /^[A-Za-z0-9+/=]+$/;
const urlOrBase64 = z.string().refine(
  (value) => z.string().url().safeParse(value).success || base64Regex.test(value),
  { message: '有効なURLまたはBase64文字列でなければなりません' }
);

export const ImageGenerationSchema = z.object({
  model_name: z.enum(['kling-v1', 'kling-v1-5', 'kling-v2']).optional(),
  
  prompt: z.string()
    .min(1, 'プロンプトは空にできません')
    .max(2500, 'プロンプトは2500文字を超えてはいけません'),
  
  negative_prompt: z.string()
    .max(2500, 'ネガティブプロンプトは2500文字を超えてはいけません')
    .optional(),
  
  image: urlOrBase64.optional(),
  
  image_reference: z.enum(['subject', 'face']).optional(),
  
  image_fidelity: z.number()
    .min(0, '画像参照強度は0～1の間でなければなりません')
    .max(1, '画像参照強度は0～1の間でなければなりません')
    .optional(),
  
  human_fidelity: z.number()
    .min(0, '顔参照強度は0～1の間でなければなりません')
    .max(1, '顔参照強度は0～1の間でなければなりません')
    .optional(),
  
  n: z.number()
    .int('生成数は整数でなければなりません')
    .min(1, '生成数は少なくとも1でなければなりません')
    .max(9, '生成数は最大9です')
    .optional(),
  
  aspect_ratio: z.enum([
    '16:9', '9:16', '1:1', '4:3', '3:4', '3:2', '2:3', '21:9'
  ]).optional(),
})
// クロスバリデーション：model_nameがkling-v1-5の場合、image_referenceが必須
.refine(
  (data) => data.model_name !== 'kling-v1-5' || data.image_reference !== undefined,
  {
    path: ['image_reference'],
    message: 'kling-v1-5モデルを使用する場合、image_referenceを指定する必要があります'
  }
)
// クロスバリデーション：image_referenceがsubjectの場合、human_fidelityが必須
.refine(
  (data) => data.image_reference !== 'subject' || data.human_fidelity !== undefined,
  {
    path: ['human_fidelity'],
    message: 'image_referenceがsubjectの場合、human_fidelityを指定する必要があります'
  }
)
// クロスバリデーション：imageが存在する場合、negative_promptは無効（強制ではなく、警告のみ）
.refine(
  (data) => data.image === undefined || data.negative_prompt === undefined,
  {
    path: ['negative_prompt'],
    message: '画像生成モードでは、negative_promptパラメータは無効です'
  }
);