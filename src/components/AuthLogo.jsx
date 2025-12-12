import { Link } from 'react-router-dom'
const AuthLogo = () => {
  return (
    <div className="auth-brand p-4 text-center">
      <Link to="#" className="logo-light">
        <img src="/green-logo_reduse.png" alt="logo" height={60} />
      </Link>
      <Link to="#" className="logo-dark">
        <img src="/green-logo_reduse.png" alt="dark logo" height={60} />
      </Link>
    </div>
  )
}
export default AuthLogo
