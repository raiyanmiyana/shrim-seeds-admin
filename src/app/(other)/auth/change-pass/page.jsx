import { Card, Col, Container, Row, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import AuthLogo from '@/components/AuthLogo'
import authImg from '@/assets/images/auth-img.jpg'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PasswordFormInput from '@/components/form/PasswordFormInput'
import { Fragment } from 'react'
import { useForm } from 'react-hook-form'
import { put } from '../../../../utils/api'
import toast from 'react-hot-toast'

const ChangePass = () => {
  const navigate = useNavigate()
  const { handleSubmit, control } = useForm()

  const login = async (formData) => {
    try {
      const token = localStorage.getItem('token')
      const response = await put('/api/auth/change-password', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('API Response:', response.data)
      toast.success('Password updated successfully.')

      // ✅ Navigate to dashboard
      navigate('/auth/login')
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className="account-pages p-sm-5  position-relative">
      <Container>
        <Row className="justify-content-center">
          <Col xxl={9} lg={11}>
            <Card className="overflow-hidden">
              <Row className="g-0">
                <Col lg={6}>
                  <div className="d-flex flex-column h-100">
                    <AuthLogo />
                    <div className="p-4 my-auto text-center">
                      <h4 className="fs-20">Change Password</h4>
                      <p className="text-muted mb-4">
                        Update your password by entering your current <br /> and new password below.
                      </p>
                      <form onSubmit={handleSubmit(login)} className="text-start">
                        <PasswordFormInput
                          control={control}
                          name="oldPassword"
                          containerClassName="mb-3"
                          placeholder="Enter old your password"
                          id="oldPassword"
                          label={
                            <Fragment>
                              <label htmlFor="password" className="form-label">
                                Old Password
                              </label>
                            </Fragment>
                          }
                        />

                        <PasswordFormInput
                          control={control}
                          name="newPassword"
                          containerClassName="mb-3"
                          placeholder="Enter new your password"
                          id="newPassword"
                          label={
                            <Fragment>
                              <label htmlFor="password" className="form-label">
                                New Password
                              </label>
                            </Fragment>
                          }
                        />

                        <div className="mb-0 text-start">
                          <Button variant="soft-primary" className="w-100" type="submit">
                            <IconifyIcon icon="ri:login-circle-fill" className="me-1" /> <span className="fw-bold">Submit</span>
                          </Button>
                        </div>
                        {/* <ThirdPartyLogin /> */}
                      </form>
                    </div>
                  </div>
                </Col>
                <Col lg={6} className="d-none d-lg-block">
                  <img src={authImg} alt="image" className="img-fluid rounded h-100" />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default ChangePass
