import { SignupForm } from './signup-form'

export default function Page() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center bg-muted p-6 md:p-10">
			<div className="w-full max-w-sm md:max-w-lg">
				<SignupForm />
			</div>
		</div>
	)
}
