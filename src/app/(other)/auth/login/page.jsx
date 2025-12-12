import { Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AuthLogo from '@/components/AuthLogo'
import LoginForm from './components/LoginForm'
import authImg from '@/assets/images/auth-img.jpg'
const Login = () => {
  return (
    <div className="account-pages p-sm-5  position-relative">
      <Container>
        <Row className="justify-content-center">
          <Col xxl={5} lg={5}>
            <Card className="overflow-hidden">
              <Row className="g-0">
                <Col>
                  <div className="d-flex flex-column h-100">
                    <AuthLogo />
                    <div className="p-4 my-auto text-center">
                      <h4 className="fs-20">Sign In</h4>
                      <p className="text-muted mb-4">
                        Enter your email address and password to <br /> access account.
                      </p>
                      <LoginForm />
                    </div>
                  </div>
                </Col>
                {/* <Col lg={6} className="d-none d-lg-block">
                  <img src={authImg} alt="image" className="img-fluid rounded h-100" />
                </Col> */}
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default Login
