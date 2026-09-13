import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl w-full p-4 flex-1">{children}</main>
      <Footer />
    </div>
  )
}
