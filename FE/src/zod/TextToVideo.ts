import { z } from 'zod';


// テキストから動画生成タスク作成リクエストボディ
export const TextToVideoRequestSchema = z.object({
  model_name: z.enum(['kling-v1', 'kling-v1-6', 'kling-v2-master']).optional(),
  prompt: z.string().nonempty('プロンプト（肯定的な指示）は空にできません').max(2500, 'プロンプト（肯定的な指示）の長さは2500文字を超えてはなりません'),
  negative_prompt: z.string().max(2500, 'ネガティブプロンプトの長さは2500文字を超えてはなりません').optional(),
  cfg_scale: z.number().min(0).max(1).optional(),
  mode: z.enum(['std', 'pro']).optional(),
  aspect_ratio: z.enum(['16:9', '9:16', '1:1']).optional(),
  duration: z.enum(['5', '10']).optional()
});

// カスタムエラーメッセージマッピング
export const TextToVideoValidationErrorMap: z.ZodErrorMap = (issue, ctx) => {
  const errorMessages: Record<string, string> = {
    'model_name': '無効なモデル名です。有効な値: kling-v1、kling-v1-6、kling-v2-master',
    'prompt': 'プロンプト（肯定的な指示）は必須項目で、長さは2500文字以内でなければなりません',
    'negative_prompt': 'ネガティブプロンプトの長さは2500文字を超えてはなりません',
    'cfg_scale': '自由度は0～1の間で指定してください',
    'mode': '無効な生成モードです。有効な値: std、pro',
    'camera_control.type': '無効なカメラ制御タイプです',
    'aspect_ratio': '無効なアスペクト比です。有効な値: 16:9、9:16、1:1',
    'duration': '無効な動画の長さです。有効な値: 5または10'
  };

  if (issue.path.length > 0) {
    const pathKey = issue.path.join('.');
    if (errorMessages[pathKey]) {
      return { message: errorMessages[pathKey] };
    }
  }

  // simpleモードの特殊エラーメッセージ
  if (issue.code === z.ZodIssueCode.custom) {
    return { message: 'simpleモードではconfigパラメータを設定する必要があります' };
  }

  // デフォルトエラーメッセージ
  return { message: ctx.defaultError };
};