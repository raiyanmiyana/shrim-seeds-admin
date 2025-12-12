import { Link } from 'react-router-dom'
import logoSm from '@/assets/images/logo-sm.png'
import logoDark from '@/assets/images/logo-dark.png'
import newLogo from '/green-logo_reduse.png'
const LogoBox = () => {
  return (
    <>
      <Link to="/" className="logo logo-light" style={{ padding: '30px' }}>
        <span className="logo-lg">
          <img style={{ height: '7rem' }} src={newLogo} className="w-auto" alt="logo" />
        </span>
        <span className="logo-sm">
          <img src="dfsd" className="w-auto" alt="" />
        </span>
      </Link>

      <Link to="/" className="logo logo-dark" style={{ padding: '30px' }}>
        <span className="logo-lg">
          <img src={logoDark} alt="dark logo" className="w-auto" />
        </span>
        <span className="logo-sm">
          <img src="dfsd" alt="" className="w-auto" />
        </span>
      </Link>
    </>
  )
}
export default LogoBox
