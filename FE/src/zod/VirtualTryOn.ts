import { z } from 'zod';

// モデルタイプの列挙
export const TryOnModelType = z.enum(['kolors-virtual-try-on-v1', 'kolors-virtual-try-on-v1-5']);

// 仮想試着リクエストボディ
export const VirtualTryOnRequestSchema = z.object({
  model_name: TryOnModelType.optional(),
  human_image: z.string().nonempty('人物モデル画像は空にできません'),
  cloth_image: z.string().nonempty('アパレル画像は空にできません')
});

// カスタムエラーメッセージマッピング
export const validationErrorMap: z.ZodErrorMap = (issue, ctx) => {
  const errorMessages: Record<string, string> = {
    'model_name': '無効なモデル名です。使用可能な値はkolors-virtual-try-on-v1、kolors-virtual-try-on-v1-5です',
    'human_image': '人物モデル画像は必須項目です',
    'cloth_image': 'アパレル画像は必須項目です'
  };

  if (issue.path.length > 0) {
    const pathKey = issue.path.join('.');
    if (errorMessages[pathKey]) {
      return { message: errorMessages[pathKey] };
    }
  }

  return { message: ctx.defaultError };
};