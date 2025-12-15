import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

// auth
const Login = lazy(() => import('@/app/(other)/auth/login/page'))
const ChangePassword = lazy(() => import('@/app/(other)/auth/change-pass/page'))
const ResetPassword = lazy(() => import('@/app/(other)/auth/reset-password/page'))
const Register = lazy(() => import('@/app/(other)/auth/register/page'))
const Logout = lazy(() => import('@/app/(other)/auth/logout/page'))
const ForgotPassword = lazy(() => import('@/app/(other)/auth/forgot-pass/page'))
const LockScreen = lazy(() => import('@/app/(other)/auth/lock-screen/page'))

// dashboard
const Dashboard = lazy(() => import('@/app/(admin)/dashboard/page'))

// infliuencer
const InfluencerContantPage = lazy(() => import('@/app/(admin)/influencerContant/influencerContant.jsx'))
const InfluencerContantForm = lazy(() => import('@/app/(admin)/influencerContant/influencerContantForm.jsx'))
const InfluencerContantFormUpdate = lazy(() => import('@/app/(admin)/influencerContant/influencerContantFormUpdate.jsx'))

// counter
const CreatorCount = lazy(() => import('@/app/(admin)/creatorCount/creatorCount.jsx'))
const CreatorCountForm = lazy(() => import('@/app/(admin)/creatorCount/creatorCountForm.jsx'))
const CreatorCountById = lazy(() => import('@/app/(admin)/creatorCount/creatorCountById.jsx'))

// brands
const BrandsTable = lazy(() => import('@/app/(admin)/brands/brandsTable.jsx'))
const BrandsForm = lazy(() => import('@/app/(admin)/brands/brandsForm.jsx'))
const BrandsFormById = lazy(() => import('@/app/(admin)/brands/brandsFormById.jsx'))

// Users
const UserList = lazy(() => import('@/app/(admin)/users/userList.jsx'))

// error
const Error404 = lazy(() => import('@/app/(other)/(error-pages)/error-404/page'))

const initialRoutes = [
  {
    path: '/',
    name: 'root',
    element: <Navigate to="/dashboard" />,
  },
]

// dashboards
const generalRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: <InfluencerContantPage />,
  },
]

// ui
const uiRoutes = [
  {
    path: '/main-category/details',
    name: 'influencer details',
    element: <InfluencerContantPage />,
  },
  {
    path: '/main-category/details/form',
    name: 'influencer details form',
    element: <InfluencerContantForm />,
  },
  {
    path: '/main-category/details/form/:id',
    name: 'influencer details form update',
    element: <InfluencerContantFormUpdate />,
  },
  {
    path: '/sub-category/details',
    name: 'Creator Count',
    element: <CreatorCount />,
  },
  {
    path: '/sub-category/details/form',
    name: 'Creator Count',
    element: <CreatorCountForm />,
  },
  {
    path: '/sub-category/details/form/:id',
    name: 'Creator Count',
    element: <CreatorCountById />,
  },
  {
    path: '/products/details',
    name: 'Brand Table',
    element: <BrandsTable />,
  },
  {
    path: '/brands/form',
    name: 'Brand Form',
    element: <BrandsForm />,
  },
  {
    path: '/brands/form/:id',
    name: 'Brand Form By Id',
    element: <BrandsFormById />,
  },
  {
    path: '/users',
    name: 'All Users',
    element: <UserList />,
  },
]

// auth
const authRoutes = [
  {
    path: '/auth/login',
    name: 'Login',
    element: <Login />,
  },
  {
    path: '/auth/change-password',
    name: 'Change Password',
    element: <ChangePassword />,
  },
  {
    path: '/auth/reset-password/:id',
    name: 'Reset Password',
    element: <ResetPassword />,
  },
  {
    path: '/auth/register',
    name: 'Register',
    element: <Register />,
  },
  {
    path: '/auth/logout',
    name: 'Logout',
    element: <Logout />,
  },
  {
    path: '/auth/forgot-password',
    name: 'Forgot Password',
    element: <ForgotPassword />,
  },
  {
    path: '/auth/lock-screen',
    name: 'Lock Screen',
    element: <LockScreen />,
  },
]

// public routes
const otherPublicRoutes = [
  {
    path: '*',
    name: 'Error - 404',
    element: <Error404 />,
  },
]
export const appRoutes = [...initialRoutes, ...generalRoutes, ...uiRoutes]
export const publicRoutes = [...authRoutes, ...otherPublicRoutes]
