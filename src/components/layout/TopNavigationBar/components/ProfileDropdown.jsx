import { Dropdown, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
// import avatar1 from '@/assets/images/users/avatar-1.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useAuthContext } from '@/context/useAuthContext'
import toast from 'react-hot-toast'
import { post } from '../../../../utils/api'
const ProfileDropdown = () => {
  const { removeSession } = useAuthContext()
  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  // Logout Function
  const logout = async () => {
    try {
      const res = await post(
        '/api/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Optionally remove token from local storage or state
      localStorage.removeItem('token')

      toast.success('You have been logged out successfully.')
      navigate('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout. Please try again.')
    }
  }

  // Change Password
  const changePassword = () => {
    navigate('/auth/change-password')
  }

  return (
    <Dropdown>
      <DropdownToggle as="a" className="nav-link arrow-none nav-user" role="button" aria-haspopup="false" aria-expanded="false">
        <span className="d-lg-block d-none">
          <h5 className="my-0 fw-normal">
            Admin
            <IconifyIcon icon="ri:arrow-down-s-line" className="fs-22 d-none d-sm-inline-block align-middle" />
          </h5>
        </span>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end dropdown-menu-animated profile-dropdown">
        <DropdownHeader className="noti-title">
          <h6 className="text-overflow m-0">Welcome !</h6>
        </DropdownHeader>
        {/* <DropdownItem onClick={changePassword}>
          <IconifyIcon icon="ri:logout-circle-r-line" className="align-middle me-1" />
          <span>Change Password</span>
        </DropdownItem> */}
        <DropdownItem onClick={logout}>
          <IconifyIcon icon="ri:logout-circle-r-line" className="align-middle me-1" />
          <span>Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
export default ProfileDropdown
