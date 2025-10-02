'use server'

import { auth } from '@/lib/auth'

export const signIn = async (formData: FormData) => {
	console.log('form data', formData)
}

export const signup = async (formData: FormData) => {
	const data = await auth.api.signUpEmail({
		body: formData,
	})
}
