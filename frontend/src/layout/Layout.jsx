import { Outlet } from "react-router-dom"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

// eslint-disable-next-line react/prop-types
function Layout() {
  return (
    <div className="min-h-screen">
        <div className="pb-[75px]">
          <Navbar />
        </div>
        <div className="minfullh flex flex-col justify-between">
          <Outlet />
          <Footer />
        </div>
    </div>
  )
}

export default Layout