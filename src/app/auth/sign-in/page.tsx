import { LoginForm } from './login-form'

export default function Page() {
  return (
    <div className="bg-muted flex flex-1 flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
