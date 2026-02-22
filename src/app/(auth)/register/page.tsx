import type { Metadata } from 'next'
import { RegisterForm } from './register-form'

export const metadata: Metadata = { title: 'Create Account' }

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Get started with your account</p>
      </div>
      <RegisterForm />
    </div>
  )
}
