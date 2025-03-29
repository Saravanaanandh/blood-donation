import { useAuthStore } from "../store/useAuthStore.jsx"
import { Link, useParams} from "react-router"
import {ArrowBigRightDashIcon, LogOut, Mail, User} from 'lucide-react'
import logo from './../assets/logo.png'
import {motion} from 'framer-motion'
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
    <motion.div 
        className={`relative w-full flex justify-between items-center ${isProfilePage || isAll || isSingle ? 'p-4' : 'p-5 sm:p-10'}`}
        initial={{translateY: '-100px',opacity:0}}
        animate={{translateY:0,opacity:1}}
        transition={{type:'spring',duration:1.2, delay:0.4}}
    >
        <Link to='/'>
            <div className="text-[0.9rem] sm:text-[1.2rem] cursor-pointer">
                <h1 className="flex items-center"><img className="mr-3 w-6 sm:w-10 inline-block drop-shadow-lg"   src={logo} alt="" /> <strong className="">GCES <span  style={{textShadow:'0 0 2px #000'}} className={authUser ? "text-red-500":"text-blue-400"}>BLOOD LINE</span></strong></h1>
            </div>
        </Link>
        <div className="flex items-center"> 
            {
                !isProfilePage && (
                    <div className="flex gap-5">
                        {/* <Link className="text-nowrap cursor-pointer rounded-md transition-all duration-200 text-red-600  px-2 sm:px-4 py-1 sm:py-2 flex flex-col items-center justify-around bg-white" to='/dashboard'> 
                            <button className="cursor-pointer  flex gap-1" onClick={handleProfileClick}>
                                Go to Dashboard <motion.span  
                                    animate={{ x: [0, 10, 0] }}
                                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1, ease: "easeInOut" }}
                                ><ArrowBigRightDashIcon/></motion.span>
                            </button>
                        </Link> */}
                        <Link className="bg-red-500 rounded-md text-white px-1.5 py-1 sm:px-3 sm:py-2 transition-all duration-200 hover:scale-105" to='/profile'> 
                            <button className="cursor-pointer  flex gap-1" onClick={handleProfileClick}>
                                <User/> profile
                            </button>
                        </Link> 
                    </div>
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
    </motion.div>
  )
}

export default Navbar