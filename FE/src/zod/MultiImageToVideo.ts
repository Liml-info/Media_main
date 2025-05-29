import { z } from 'zod';

// 1枚の参照画像設定
const ImageItemSchema = z.object({
  image: z.string().nonempty().describe('画像URLまたはBase64エンコードは空にできません')
});

// 複数画像参照動画生成タスクリクエストボディ
export const MultiImageToVideoRequestSchema = z.object({
  model_name: z.literal('kling-v1-6').optional(),
  image_list: z.array(ImageItemSchema)
    .min(1, '少なくとも1枚の参照画像を提供する必要があります')
    .max(4, '参照画像の数は4枚を超えてはなりません'),
  prompt: z.string().nonempty('プロンプト（肯定的な指示）は空にできません').max(2500, 'プロンプト（肯定的な指示）の長さは2500文字を超えてはなりません').optional(),
  negative_prompt: z.string().max(2500, 'ネガティブプロンプトの長さは2500文字を超えてはなりません').optional(),
  mode: z.enum(['std', 'pro']).optional(),
  duration: z.enum(['5', '10']).optional(),
  aspect_ratio: z.enum(['16:9', '9:16', '1:1']).optional()
});

// カスタムエラーメッセージマッピング
export const MultiImageToVideoValidationErrorMap: z.ZodErrorMap = (issue, ctx) => {
  const errorMessages: Record<string, string> = {
    'model_name': '無効なモデル名です。現在はkling-v1-6のみサポートされています',
    'image_list': '参照画像の数は1枚から4枚の間である必要があります',
    'prompt': 'プロンプト（肯定的な指示）の長さは2500文字を超えてはなりません',
    'negative_prompt': 'ネガティブプロンプトの長さは2500文字を超えてはなりません',
    'mode': '無効な生成モードです。有効な値はstd、proです',
    'duration': '無効な動画の長さです。有効な値は5または10です',
    'aspect_ratio': '無効なアスペクト比です。有効な値は16:9、9:16、1:1です'
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