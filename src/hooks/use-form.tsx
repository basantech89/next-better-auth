import type { StandardSchemaV1 } from 'better-auth'
import type Form from 'next/form'
import React, { useActionState } from 'react'
import { toast } from 'react-hot-toast'

import { keys, values as objValues } from '@/utils/object'
import type { Dict } from '@/utils/types'
import type { z } from '@/utils/zod'

type FormValue = string | number | readonly string[] | undefined

type Listener = () => void

const notify = (notifyListener: Listener) => {
	notifyListener()
}

function createFormStore<K extends string, V extends FormValue>(
	initialValues: Dict<K, V>,
	schema?: z.ZodObject<Dict<K, z.ZodType<V>>>,
) {
	const values = { ...initialValues }

	const errors: { [key in K]?: string } = {}

	const listeners = new Map<K, Set<Listener>>()
	const allListeners = new Set<Listener>()

	const fieldValues = keys(values).reduce(
		(acc, key) => {
			acc[key] = { value: values[key], error: errors[key] }
			return acc
		},
		{} as { [key in K]: { value: V; error?: string } },
	)

	const subscribe = (name: K, listener: Listener) => {
		let subscribers = listeners.get(name)

		if (!subscribers) {
			subscribers = new Set<Listener>()
			listeners.set(name, subscribers)
		}

		subscribers.add(listener)

		return () => {
			const subscribers = listeners.get(name)
			if (subscribers) {
				subscribers.delete(listener)
			}
		}
	}

	const subscribeAll = (listener: Listener) => {
		allListeners.add(listener)

		return () => {
			allListeners.delete(listener)
		}
	}

	const getValue = (name: K) => {
		const prev = fieldValues[name]
		const nextValue = values[name]
		const nextError = errors[name]

		if (prev && prev.value === nextValue && prev.error === nextError) {
			return prev
		}

		const next = { value: nextValue, error: nextError }
		fieldValues[name] = next

		return next
	}

	const isFormValid = () => {
		const allFilled = objValues(values).every(Boolean)
		const noErrors = !objValues(errors).some(Boolean)

		return allFilled && noErrors
	}

	let cachedSnapshot = { values, errors, isValid: isFormValid() }

	const setValue = (name: K, value: V) => {
		if (values[name] === value) {
			return
		}

		values[name] = value

		// Recompute cached snapshot after value update
		cachedSnapshot = { values, errors, isValid: isFormValid() }

		const subscribers = listeners.get(name)
		if (subscribers) {
			// Notify field-level subscribers
			subscribers.forEach(notify)
		}

		// Notify form-level subscribers
		if (allListeners.size > 0) {
			allListeners.forEach(notify)
		}
	}

	const getValues = () => {
		// Return the cached snapshot to keep getServerSnapshot stable
		return cachedSnapshot
	}

	const notifyFields = (names: Set<K>) => {
		names.forEach((name) => {
			const subscribers = listeners.get(name)
			if (subscribers) {
				subscribers.forEach(notify)
			}
		})
	}

	const validate = async (name: K) => {
		if (!schema) {
			return
		}

		let result = schema['~standard'].validate(values)
		if (result instanceof Promise) {
			result = await result
		}

		const fieldsToNotify = new Set<K>()

		const dependentFields: K[] = [name]

		let issues: StandardSchemaV1.Issue[] = []
		if (result.issues && result.issues.length > 0) {
			issues = result.issues.filter((issue) => issue.path?.includes?.(name))

			const meta = schema.shape[name].meta()
			if (meta?.dependOn) {
				dependentFields.push(...(meta.dependOn as K[]))
			}

			if (issues.length > 0) {
				errors[name] = issues.reduce<string>((acc, issue) => {
					if (!issue.path?.includes?.(name)) {
						return acc
					}

					if (!acc) {
						return issue.message
					}

					return `${acc}, ${issue.message}`
				}, '')
			}
		}

		if (!result.issues?.length || !issues.length) {
			dependentFields.forEach((field) => {
				delete errors[field]
			})
		}

		dependentFields.forEach((field) => {
			fieldsToNotify.add(field)
		})

		// Recompute cached snapshot after validation updates
		cachedSnapshot = { values, errors, isValid: isFormValid() }

		notifyFields(fieldsToNotify)

		// Notify form-level subscribers
		if (allListeners.size > 0) {
			allListeners.forEach(notify)
		}
	}

	return {
		subscribe,
		subscribeAll,
		getValue,
		setValue,
		getValues,
		validate,
		errors,
	}
}

// Context holds the store; consumers use useField to subscribe to a single key
const formContext = React.createContext<unknown>(null)

export function useFormContext<K extends string, V extends FormValue>() {
	const form = React.useContext(formContext) as unknown as ReturnType<
		typeof createFormStore<K, V>
	>

	if (!form) {
		throw new Error('useStoreContext must be used within a StoreProvider')
	}

	return form
}

export function useField(name: string) {
	const form = useFormContext()

	const getValueSnapshot = React.useCallback(
		() => form.getValue(name),
		[name, form],
	)

	const { value, error } = React.useSyncExternalStore(
		React.useCallback((cb) => form.subscribe(name, cb), [name, form]),
		getValueSnapshot,
		getValueSnapshot,
	)

	const onChange = React.useCallback(
		<T extends HTMLInputElement | HTMLTextAreaElement>(
			event: React.ChangeEvent<T>,
		) => {
			form.setValue(name, event.target.value)
		},
		[name, form],
	)

	const onBlur = React.useCallback(() => {
		form.validate(name)
	}, [name, form])

	return { name, value, onChange, onBlur, error }
}

export type ActionResult<T> =
	| { success: false; error: string }
	| { success: true; data?: T }

type ServerAction = <T>(
	formData: FormData,
) => void | Promise<void> | Promise<ActionResult<T>>

type FormState = {
	isFormValid: boolean
	formError: string
}

export function useForm<K extends string, V extends FormValue>({
	defaultValues,
	schema,
	action,
}: {
	defaultValues: Awaited<Dict<K, V>>
	schema?: z.ZodObject<Dict<K, z.ZodType<V>>>
	action: ServerAction
}) {
	const formRef = React.useRef(createFormStore(defaultValues, schema))

	const initialFormState: FormState = {
		isFormValid: true,
		formError: '',
	}

	const handleSubmit = async (
		state: Awaited<FormState>,
		formData: FormData,
	) => {
		try {
			const result = await action(formData)

			if (!result?.success) {
				return {
					...state,
					isFormValid: false,
					formError: result?.error || 'Something went wrong. Please try again.',
				}
			}

			return { ...state, isFormValid: true, formError: '' }
		} catch (error) {
			return {
				...state,
				isFormValid: false,
				formError:
					(error as Error)?.message ||
					'Something went wrong. Please try again.',
			}
		}
	}

	const [state, formAction, isPending] = useActionState(
		handleSubmit,
		initialFormState,
	)

	const AppForm = React.useMemo(
		() =>
			({ children }: Omit<React.ComponentProps<typeof Form>, 'action'>) => {
				return (
					<formContext.Provider value={formRef.current}>
						{children}
					</formContext.Provider>
				)
			},
		[],
	)

	const getValuesSnapshot = React.useCallback(
		() => formRef.current.getValues(),
		[],
	)

	const subscribeValues = React.useCallback(
		(cb: Listener) => formRef.current.subscribeAll(cb),
		[],
	)

	const { values, errors, isValid } = React.useSyncExternalStore(
		subscribeValues,
		getValuesSnapshot,
		getValuesSnapshot,
	)

	return { AppForm, values, errors, isValid, isPending, formAction, ...state }
}
