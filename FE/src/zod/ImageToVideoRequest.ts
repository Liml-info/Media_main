import { z } from 'zod';

// 画像から動画生成タスク作成リクエストボディ
export const ImageToVideoRequestSchema = z.object({
  model_name: z.enum(['kling-v1', 'kling-v1-5', 'kling-v1-6', 'kling-v2-master']).optional(),
  image: z.string().nonempty().describe('参照画像は必須です'),
  image_tail: z.string().optional(),
  prompt: z.string().max(2500, 'プロンプト（肯定的な指示）の長さは2500文字以内でなければなりません').optional(),
  negative_prompt: z.string().max(2500, 'ネガティブプロンプトの長さは2500文字以内でなければなりません').optional(),
  cfg_scale: z.number().min(0).max(1).optional(),
  mode: z.enum(['std', 'pro']).optional(),
  static_mask: z.string().optional(),
  aspect_ratio: z.enum(['16:9', '9:16', '1:1']).optional(),
  duration: z.enum(['5', '10']).optional()
});

// カスタムエラーメッセージマッピング
export const ImageToVideoValidationErrorMap: z.ZodErrorMap = (issue, ctx) => {
  const errorMessages: Record<string, string> = {
    'model_name': '無効なモデル名です。有効な値: kling-v1、kling-v1-5、kling-v1-6、kling-v2-master',
    'image': '参照画像は必須項目です',
    'prompt': 'プロンプト（肯定的な指示）の長さは2500文字以内でなければなりません',
    'negative_prompt': 'ネガティブプロンプトの長さは2500文字以内でなければなりません',
    'cfg_scale': '自由度は0～1の間で指定してください',
    'mode': '無効な生成モードです。有効な値: std、pro',
    'dynamic_masks': '動的マスク設定は最大6セットまでサポートします',
    'aspect_ratio': '無効なアスペクト比です。有効な値: 16:9、9:16、1:1',
    'duration': '無効な動画の長さです。有効な値: 5または10'
  };

  if (issue.path.length > 0) {
    const pathKey = issue.path.join('.');
    if (errorMessages[pathKey]) {
      return { message: errorMessages[pathKey] };
    }
  }

  // デフォルトエラーメッセージ
  return { message: ctx.defaultError };
};

//ImageToVideoRequestSchema.safeParse(requestBody, { errorMap: validationErrorMap });