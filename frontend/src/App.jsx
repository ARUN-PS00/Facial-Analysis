import { Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/common/Layout'
import './styles/globals.css'
import './styles/variables.css'
import './styles/animations.css'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Outlet />
      </Layout>
    </AuthProvider>
  )
}

export default App
