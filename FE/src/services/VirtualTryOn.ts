import { z } from 'zod';

const VirtualTryOnSchema = z.object({
  human_image: z.string().url().or(z.string().regex(/^[A-Za-z0-9+/=]+$/)), // 校验URL或Base64
  cloth_image: z.string().url().or(z.string().regex(/^[A-Za-z0-9+/=]+$/)),
  model_name: z.enum(['kolors-virtual-try-on-v1', 'kolors-virtual-try-on-v1-5']).optional()
});