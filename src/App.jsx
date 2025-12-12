import { Toaster } from 'react-hot-toast'
import AppProvidersWrapper from './components/wrappers/AppProvidersWrapper'
import AppRouter from './routes/router'
import '@/assets/scss/app.scss'
function App() {
  return (
    <AppProvidersWrapper>
      <AppRouter />
      <Toaster position="top-center" reverseOrder={false} />
    </AppProvidersWrapper>
  )
}
export default App
