import { Eye, EyeClosed, InfoIcon } from 'lucide-react'
import React from 'react'

import type { TextFieldProps } from './text-field'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupContainer,
	InputGroupInput,
	Label,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui'
import { useField } from '@/hooks/use-form'
import { cn } from '@/lib/utils'

export function PasswordField({
	label,
	showTooltip = false,
	children,
	...rest
}: TextFieldProps & { showTooltip?: boolean }) {
	const { error, ...field } = useField(rest.name)
	const [passwordVisible, setPasswordVisible] = React.useState(false)

	const togglePasswordVisible = () => setPasswordVisible(!passwordVisible)

	return (
		<InputGroup>
			<div className="flex gap-2">
				{label ? <Label htmlFor={rest.id}>{label}</Label> : (children ?? null)}
				{showTooltip && (
					<Tooltip>
						<TooltipTrigger asChild>
							<InputGroupButton
								aria-label="Info"
								size="icon-xs"
								variant="ghost"
							>
								<InfoIcon />
							</InputGroupButton>
						</TooltipTrigger>
						<TooltipContent>
							<p>
								Your password must be at least 8 characters long and contain a
								mix of letters, numbers, and symbols.
							</p>
						</TooltipContent>
					</Tooltip>
				)}
			</div>

			<InputGroupContainer>
				<InputGroupInput
					type={passwordVisible ? 'text' : 'password'}
					{...field}
					{...rest}
				/>
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						aria-label="Toggle password visibility"
						onClick={togglePasswordVisible}
						size="icon-xs"
						title="Toggle password visibility"
					>
						{passwordVisible ? <EyeClosed /> : <Eye />}
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroupContainer>

			<p
				className={cn(
					'min-h-2 pl-3 text-destructive text-sm',
					error ? 'visible' : 'invisible',
				)}
			>
				{error}
			</p>
		</InputGroup>
	)
}
