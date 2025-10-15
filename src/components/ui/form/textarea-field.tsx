import React from 'react'

import { Label } from '../label'
import { Textarea } from '../textarea'
import { useField } from '@/hooks/use-form'
import { cn } from '@/lib/utils'

export type TextareaFieldProps = React.ComponentProps<'textarea'> & {
	id?: string
	label?: string
	name: string
}

const TextareaField = React.memo(function InnerTextareaField({
	id,
	label,
	name,
	...rest
}: TextareaFieldProps) {
	const { error, ...field } = useField(name)

	return (
		<div className={cn(label && 'grid gap-3')}>
			{label && <Label htmlFor={id}>{label}</Label>}
			<div className="flex flex-col gap-1">
				<Textarea id={id} {...rest} {...field} />
				<p
					className={cn(
						'min-h-2 pl-3 text-destructive text-sm',
						error ? 'visible' : 'invisible',
					)}
				>
					{error}
				</p>
			</div>
		</div>
	)
})

export { TextareaField }
