import dotenv from 'dotenv'
import { createJiti } from 'jiti'
import type { NextConfig } from 'next'

const jiti = createJiti(import.meta.url)

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

jiti.import('./src/env/server')
jiti.import('./src/env/client')

const nextConfig: NextConfig = {
	logging: {
		fetches: {
			fullUrl: true,
			hmrRefreshes: true,
		},
	},
	experimental: {
		cacheComponents: true,
		ppr: true,
	},
}

export default nextConfig
