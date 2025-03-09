import { useAuthStore } from "../store/useAuthStore.jsx"
import { Link, useParams} from "react-router"
import {LogOut, Mail, User} from 'lucide-react'
import logo from './../assets/logo.png'
const Navbar = () => {

    const {authUser,logout} = useAuthStore()
    const handleProfileClick = async()=>{
        console.log(authUser)
    }
    const {id:userId} = useParams()

    const isReqFormPage = location.pathname === '/request'
    const isProfilePage =  location.pathname === '/profile' 
    const isAll = location.pathname === '/alldonors' || location.pathname === `/allrequests`
    const isSingle = location.pathname === `/alldonors/${userId}` || location.pathname === `/allrequests/${userId}`

  return (
    <div className={`relative w-full flex justify-between items-center ${isProfilePage || isAll || isSingle ? 'p-4' : 'p-5 sm:p-10'}`}>
        <Link to='/'>
            <div className="text-[0.9rem] sm:text-[1.2rem] cursor-pointer">
                <h1 className="flex items-center"><img className="mr-3 w-6 sm:w-10 inline-block" src={logo} alt="" /> <strong>GCES <span className={authUser ? "text-red-500":"text-blue-400"}>BLOOD LINE</span></strong></h1>
            </div>
        </Link>
        <div className="flex items-center"> 
            {
                !isProfilePage && (
                    <Link className="bg-red-500 rounded-md text-white px-1.5 py-1 sm:px-3 sm:py-2 transition-all duration-200 hover:scale-105" to='/profile'> 
                        <button className="cursor-pointer  flex gap-1" onClick={handleProfileClick}>
                            <User/> profile
                        </button>
                    </Link>
                )
            }
            
            {
                isReqFormPage && (
                    <Link to='/allrequests'>
                        <button className="ml-1 sm:ml-5 bg-red-500 rounded-md text-white px-1.5 py-1 sm:px-3 sm:py-2 transition-all duration-200 hover:scale-105" onClick={handleProfileClick}>
                            <Link className="flex gap-1" to='/allrequests'> <Mail/><span className="max-sm:hidden"> My Request</span></Link>
                        </button>
                    </Link>
                )
            }
            {
                isProfilePage && (
                    <Link to='/login'>
                        <button className="ml-5 bg-red-500 rounded-md text-white px-1.5 py-1 sm:px-3 sm:py-2 transition-all duration-200 hover:scale-105" onClick={logout}>
                            <div className="flex items-center gap-1 ">logout <LogOut className="size-4 sm:size-6"/></div>
                        </button>
                    </Link>
                )
            }
            
        </div>
    </div>
  )
}

export default Navbar