import React from 'react'

import { Input } from '../input'
import { Label } from '../label'
import { useField } from '@/hooks/use-form'
import { cn } from '@/lib/utils'

export default React.memo(function TextField({
	id,
	label,
	name,
	...rest
}: {
	id: string
	label?: string
	name: string
} & React.ComponentProps<'input'>) {
	const { error, ...field } = useField(name)

	return (
		<div className={cn(label && 'grid gap-3')}>
			{label && <Label htmlFor={id}>{label}</Label>}
			<div className="flex flex-col gap-1">
				<Input id={id} {...rest} {...field} />
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
