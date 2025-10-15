import type { LucideProps } from 'lucide-react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'

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

export function InputGroupField({
	tooltip,
	icon: Icon,
	label,
	...rest
}: {
	tooltip?: string
	icon: ForwardRefExoticComponent<
		Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
	>
} & TextFieldProps) {
	const { error, ...field } = useField(rest.name)

	return (
		<InputGroup>
			{label && <Label htmlFor={rest.id}>{label}</Label>}
			<InputGroupContainer>
				<InputGroupInput {...field} {...rest} />
				<InputGroupAddon align="inline-end">
					<Tooltip>
						<TooltipTrigger asChild>
							<InputGroupButton
								aria-label="Info"
								size="icon-xs"
								variant="ghost"
							>
								<Icon />
							</InputGroupButton>
						</TooltipTrigger>
						<TooltipContent>
							<p>{tooltip}</p>
						</TooltipContent>
					</Tooltip>
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
