import { z } from 'zod'

export function validateEnv<T extends z.ZodType>(schema: T): z.infer<T> {
  const result = schema.safeParse(process.env)
  if (!result.success) {
    const errors = result.error.errors.map((e) => `  ${e.path.join('.')}: ${e.message}`)
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`)
  }
  return result.data
}

export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().min(32),
})
