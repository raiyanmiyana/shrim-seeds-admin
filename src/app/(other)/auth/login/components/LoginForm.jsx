import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useNavigate, useSearchParams } from 'react-router-dom'
import TextFormInput from '@/components/form/TextFormInput'
// import useSignIn from './useSignIn'
import PasswordFormInput from '@/components/form/PasswordFormInput'
import { Button } from 'react-bootstrap'
import { Fragment } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'
import { post } from '../../../../../utils/api'

const LoginForm = () => {
  const navigate = useNavigate()
  const { handleSubmit, control } = useForm()
  const [searchParams] = useSearchParams()
  // const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  const login = async (formData) => {
    try {
      const response = await post('/api/auth/login', formData)
      console.log('API Response:', response.data)
      const token = response.data.token
      localStorage.setItem('token', token)

      toast.success('Login successful! Welcome back.')
      // ✅ Navigate to dashboard
      navigate('/dashboard', { replace: true })
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed. Please try again.')
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <form onSubmit={handleSubmit(login)} className="text-start">
      <TextFormInput control={control} name="email" containerClassName="mb-3" label="Email address" id="email-id" placeholder="Enter your email" />

      <PasswordFormInput
        control={control}
        name="password"
        containerClassName="mb-2"
        placeholder="Enter your password"
        id="password-id"
        label={
          <Fragment>
            <label htmlFor="password" className="form-label">
              Password
            </label>
          </Fragment>
        }
      />

      <div className="mb-0 text-start">
        <Button variant="soft-primary" className="w-100" type="submit">
          <IconifyIcon icon="ri:login-circle-fill" className="me-1" /> <span className="fw-bold">Log In</span>
        </Button>
      </div>
      {/* <ThirdPartyLogin /> */}
    </form>
  )
}

export default LoginForm
