import { createEnv } from '@t3-oss/env-nextjs'
import dotenv from 'dotenv'
import z from 'zod'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

export const env = createEnv({
	server: {
		DATABASE_URL: z.url(),
		BETTER_AUTH_SECRET: z.string().min(1),
		BETTER_AUTH_URL: z.url(),
		GOOGLE_CLIENT_ID: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1),
	},
	experimental__runtimeEnv: process.env,
})
