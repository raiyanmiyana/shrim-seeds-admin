import { Card, Col, Container, Row, Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import AuthLogo from '@/components/AuthLogo'
import authImg from '@/assets/images/auth-img.jpg'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PasswordFormInput from '@/components/form/PasswordFormInput'
import { Fragment } from 'react'
import { useForm } from 'react-hook-form'
import { post } from '../../../../utils/api'
import toast from 'react-hot-toast'

const resetPass = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { handleSubmit, control } = useForm()

  const reset = async (formData) => {
    try {
      const token = localStorage.getItem('token')
      const response = await post(`/api/auth/reset-password/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('API Response:', response.data)
      toast.success(response?.data?.message)
      // ✅ Navigate to login
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
                      <h4 className="fs-20">Reset Password</h4>
                      <p className="text-muted mb-4">
                        Please set a new password to <br /> complete the reset process.
                      </p>
                      <form onSubmit={handleSubmit(reset)} className="text-start">
                        <PasswordFormInput
                          control={control}
                          name="newPassword"
                          containerClassName="mb-3"
                          placeholder="Enter old your password"
                          id="oldPassword"
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
export default resetPass
