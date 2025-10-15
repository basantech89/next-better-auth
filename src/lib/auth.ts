import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'

import { db } from '@/db'
import * as schema from '@/db/schema/auth'
import { env } from '@/env/server'

export const auth = betterAuth({
	user: {
		additionalFields: {
			firstName: {
				type: 'string',
				required: true,
			},
			lastName: {
				type: 'string',
				required: false,
			},
		},
	},
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
	},
	database: drizzleAdapter(db, {
		provider: 'pg',
		usePlural: true,
		schema,
	}),
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},
	plugins: [nextCookies()],
})
