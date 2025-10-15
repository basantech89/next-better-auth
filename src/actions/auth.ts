'use server'

import { APIError } from 'better-auth'

import type { ActionResult } from '@/hooks/use-form'
import { auth } from '@/lib/auth'

const betterAuthApi = async <T, Response extends { token: string | null }>(
	data: T,
	api: (ctx: { body: T }) => Promise<Response>,
): Promise<ActionResult<Response>> => {
	try {
		const result = await api({ body: data })
		if (result.token) {
			return {
				success: true,
				data: result,
			}
		}

		return {
			success: false,
			error: 'Something went wrong. Please try again.',
		}
	} catch (error) {
		if (error instanceof APIError) {
			if (error?.statusCode !== 500) {
				return {
					success: false,
					error: error.message,
				}
			}
		}

		return {
			success: false,
			error: 'Something went wrong. Please try again.',
		}
	}
}

export const signin = async (formData: FormData) => {
	const email = formData.get('email') as string
	const password = formData.get('password') as string

	return await betterAuthApi({ email, password }, auth.api.signInEmail)
}

export const signup = async (formData: FormData) => {
	const payload = {
		firstName: formData.get('firstName') as string,
		lastName: formData.get('lastName') as string,
		name: `${formData.get('firstName')} ${formData.get('lastName')}`,
		email: formData.get('email') as string,
		password: formData.get('password') as string,
	}

	return await betterAuthApi(payload, auth.api.signUpEmail)
}
