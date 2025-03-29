import { Link } from "react-router" 
import { useRecipientStore } from "../store/useRecipientStore.jsx"
import Navbar from "../components/Navbar.jsx"
import { useAuthStore } from "../store/useAuthStore.jsx"
import { useEffect, useRef, useState } from "react"
import bannerImg from './../assets/banner.png'
import { Camera, DropletsIcon, Edit } from "lucide-react"
import profilePic from './../assets/user.png'
import ToggleButton from './../components/ToggleButton.jsx'
import editIcon from './../assets/editpng.png'
import toast from "react-hot-toast"
import { motion } from "framer-motion" 

const UpdateProfile = () => {  
    const {authUser, updateProfile,UnsubscribeToProfileUpdate,socket,getUser} = useAuthStore() 
    const {allRequests} = useRecipientStore()
    console.log(authUser)
    const [formData, setFormData] = useState({
        location:authUser.location,
        pinCode:authUser.pinCode,
        mobile:authUser.mobile
    })
    const bannerRef = useRef()
    const profileRef = useRef() 
    
    const [isMobileEdit, setisMobileEdit] = useState(false)
    const [isLocationEdit, setIsLocationEdit] = useState(false)
    const [isPincodeEdit, setIsPincodeEdit] = useState(false)

    const [banner, setBanner] = useState(null)
    const [profile, setProfile] = useState(null)
    const [otp, setOtp] = useState("")

    socket.on("completedRequest",async()=>{
        await getUser() 
    })
    
    const handleImageChange = async (e)=>{
        const file = e.target.files[0] 
        if(!file) return;

        const reader = new FileReader() 
        reader.readAsDataURL(file)
        reader.onload = async ()=>{
            const base64Img = reader.result
            setBanner(base64Img)
            await updateProfile({banner:base64Img})
        } 
    }
    const handleProfileImageChange = async (e)=>{
        const file = e.target.files[0] 
        if(!file) return;

        const reader = new FileReader() 
        reader.readAsDataURL(file)
        reader.onload = async ()=>{
            const base64Img = reader.result
            setProfile(base64Img)
            await updateProfile({profile:base64Img})
        } 
    }
    
 
    const handleEditToggle = async(e)=>{
        const target = e.target
        if(isMobileEdit){ 
            if(!target.classList.contains("Edit")){ 
                    await updateProfile(formData)
                    setisMobileEdit(false)   
            }
        }  
        if(isLocationEdit){ 
            if(!target.classList.contains("Edit")){ 
                await updateProfile(formData)
                setIsLocationEdit(false)   
            }
        }   
        if(isPincodeEdit){ 
            if(!target.classList.contains("Edit")){ 
                await updateProfile(formData)
                setIsPincodeEdit(false)   
            }
        }   
        return;
    } 
    const handleUpdataInfo = async(e,data)=>{
        if(data === "location"){ 
            setFormData({...formData, location:e.target.value}) 
            return;
        }
        if(data === "mobile"){
            if(formData.mobile.toString().length !== 10) return toast.error(" Mobile Not valid")
            setFormData({...formData, mobile:parseInt(e.target.value)})  
            return;
        }
        if(data === "pincode"){
            if(formData.pinCode.toString().length !== 6) return toast.error("pincode Not valid")
            setFormData({...formData, pinCode:parseInt(e.target.value)})  
            return;
        }
    }
    const subVarients2 = {
        hidden:{
            translateX:'100px'
        },
        visible:{
            translateX:0,
            transition:{
                type:'spring',
                delay:1,
                duration:1
            }
        },
    }
    const subVarients1 = {
        hidden:{
            translateX:'-100px'
        },
        visible:{
            translateX:0,
            transition:{
                type:'spring',
                delay:1,
                duration:1
            }
        },
    }
    const constVarients = {
        hidden:{
            translateY:'1000px'
        },
        visible:{
            translateY:0,
            transition:{
                type:'spring',
                delay:0.6,
                duration:1.4
            }
        },
    }
    return (
        <div className="min-h-[100vh]" onClick={handleEditToggle}>
            <Navbar/>
            <div className="relative rounded-lg w-full h-[25vh] sm:h-[40vh] bg-no-repeat bg-cover bg-center" style={{backgroundImage:`url(${banner || authUser.banner || bannerImg})`}}>
                <input 
                    type="file"
                    ref={bannerRef}
                    className="hidden"
                    accept="/image*"
                    onChange={handleImageChange}  
                />
                <div className="cursor-pointer absolute p-1 bg-gray-300 rounded-full bottom-2 right-2 hover:text-white transition-colors duration-300 ease-in-out" onClick={()=>bannerRef.current?.click()}>
                    <Edit className="size-3 sm:size-5"/>
                </div>
            </div>
            <div className="sm:sticky top-22">
            <motion.div 
                className="relative"
                initial={{translateY:-1000,opacity:0.5}}
                animate={{translateY:0,opacity:1}}
                transition={{type:'spring', duration:0.5, delay:0.4,stiffness:70}}
            >
                <div className="absolute -top-10 sm:-top-20 left-5 sm:left-10 w-[80vw] sm:w-[25vw] h-auto sm:h-[60vh] rounded-md shadow-md bg-white shadow-gray-500 p-5 flex flex-col max-sm:gap-5 sm:justify-between items-center">
                    <div className=" top-0 w-full flex justify-center">
                        <div className="cursor-pointer relative inline-block"> 
                            <input 
                                type="file" 
                                className="hidden"
                                ref={profileRef}
                                accept="/image*"
                                onChange={handleProfileImageChange}
                            />
                            <Camera onClick={()=> profileRef.current.click()} className="p-1 size-5 sm:size-6 bg-gray-300 rounded-full absolute bottom-0 right-0 "/>
                            <img className="border-[1px] rounded-full size-23" src={profile || authUser.profile || profilePic} alt="profile picture" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <h1 className="sm:text-[1.2rem]"><strong>{authUser.username}</strong></h1>
                        <h1 className="">{authUser.email}</h1>
                        <div className="w-full flex justify-center gap-1 sm:gap-3"> 
                            <span>Available:</span>
                            <ToggleButton 
                                Available={authUser?.available}
                            />
                        </div> 
                        <h1 className="flex gap-2 text-[1rem] sm:text-[1.2rem]">Donations : {authUser.donation}<span className="text-red-600 "><DropletsIcon className="size-5 sm:size-6"/></span></h1>
                    </div>
                    <div className="w-full flex flex-col gap-2"> 
                        <Link to='/allrequests'>
                            <button className="cursor-pointer w-full sm:py-1.5 py-1  rounded-md text-red-500 border-[1px] border-red-500">
                                My recipients
                            </button>
                        </Link>
                        <Link to='/alldonors'>
                            <button className="cursor-pointer w-full sm:py-1.5 py-1 bg-red-500 rounded-md text-white"> 
                                My Request
                            </button>
                        </Link> 
                    </div> 
                </div> 
            </motion.div> 
            </div>
            <div className="w-full flex flex-col items-center justify-center sm:w-4/6  absolute max-sm:top-[80vh] right-[0vw] sm:right-0 mt-6 sm:px-5">
                <motion.h1 className="text-[2rem] text-center"  variants={constVarients}
                    initial="hidden"
                    animate="visible" ><strong>Profile</strong></motion.h1>
                <motion.ul 
                    className="flex flex-col gap-5 sm:w-3/4 my-10 leading-8 sm:leading-10"
                    variants={constVarients}
                    initial="hidden"
                    animate="visible" 
                >
                    <motion.li 
                        className="w-full flex justify-between border-b-[1px] border-b-black sm:sm:px-5"
                        variants={constVarients}
                    >
                        <motion.h3
                            variants={subVarients1}
                        >Age</motion.h3>
                        <motion.p
                            variants={subVarients2}
                        >
                           {authUser.age} 
                        </motion.p>
                    </motion.li>
                    <motion.li 
                        className="w-full flex justify-between border-b-[1px] border-b-black sm:sm:px-5"
                        variants={constVarients}
                    >
                        <motion.h3
                            variants={subVarients1}
                        >Blood Type</motion.h3>
                        <motion.p
                            variants={subVarients2}
                        >
                           {authUser.bloodType} 
                        </motion.p>
                    </motion.li>
                    <motion.li 
                        className="w-full flex justify-between border-b-[1px] border-b-black sm:sm:px-5"
                        variants={constVarients}
                    >
                        <motion.h3
                            variants={subVarients1}
                        >Lastly Donated Date :</motion.h3>
                        <motion.p
                            variants={subVarients2}
                        >
                           {authUser.lastDonated ? new Date(authUser.lastDonated).toISOString().split('T')[0] : "No donations!"} 
                        </motion.p>
                    </motion.li>
                    {
                    authUser.nextDonationDate ? (
                    <motion.li 
                        className="w-full flex justify-between border-b-[1px] border-b-black sm:sm:px-5"
                        variants={constVarients}
                    >
                        <motion.h3
                            variants={subVarients1}
                        >Suggest to Donate After(90days)</motion.h3>
                        <motion.p
                            variants={subVarients2}
                        >
                           {new Date(authUser.nextDonationDate).toISOString().split('T')[0]}
                        </motion.p>
                    </motion.li>
                        ) : ("")
                    } 
                    <motion.li 
                        className="w-full flex justify-between border-b-[1px] border-b-black sm:sm:px-5"
                        variants={constVarients}
                    >
                        <motion.h3
                            variants={subVarients1}
                        >Gender</motion.h3>
                        <motion.p
                            variants={subVarients2}
                        >
                           {authUser.gender} 
                        </motion.p>
                    </motion.li>
                    <motion.li 
                        className="w-full flex justify-between border-b-[1px] border-b-black sm:sm:px-5"
                        variants={constVarients}
                    >
                        <motion.h3
                            variants={subVarients1}
                        >Age</motion.h3>
                        <motion.p
                            variants={subVarients2}
                        >
                           {authUser.age} 
                        </motion.p>
                    </motion.li>
                    <motion.li 
                        className="w-full flex justify-between border-b-[1px] border-b-black sm:sm:px-5"
                        variants={constVarients}
                    >
                        <motion.h3
                            variants={subVarients1}
                        >Age</motion.h3>
                        <motion.p
                            variants={subVarients2}
                        >
                           {authUser.age} 
                        </motion.p>
                    </motion.li>  
                    <motion.li 
                        className="w-full flex items-center justify-between border-b-[1px] border-b-black sm:px-5"
                        variants={constVarients}
                    >
                        <motion.h3
                            variants={subVarients1}
                        >Location</motion.h3>
                        <motion.div className="flex items-center gap-3" variants={subVarients2}>
                            <div>
                                {
                                    isLocationEdit ? (
                                        <input 
                                            className="Edit outline-none border-b-[1px] w-[10vw]"
                                            type="text" 
                                            value={formData.location || ""}
                                            autoFocus 
                                            onChange={(e)=>handleUpdataInfo(e,"location")}
                                        />
                                    ) : (
                                        <motion.p
                                            variants={subVarients2}
                                        >
                                        {authUser.location} 
                                        </motion.p>
                                    )
                                }
                            </div> 
                            <button className="EditIcon size-4 cursor-pointer" onClick={()=> setIsLocationEdit(!isLocationEdit)}>
                              <img className="EditIcon" src={editIcon}/>
                            </button>
                        </motion.div> 
                    </motion.li>
                    <motion.li className="w-full flex items-center justify-between border-b-[1px] border-b-black sm:px-5" variants={constVarients}>
                        <motion.h3
                            variants={subVarients1}
                        >Pincode</motion.h3>
                        <motion.div className="flex items-center gap-3" variants={subVarients2}>
                            <div>
                                {
                                    isPincodeEdit ? (
                                        <input 
                                            className="Edit outline-none border-b-[1px] w-[10vw]"
                                            type="text" 
                                            placeholder={`${formData.pinCode ? '': "600012"}`}
                                            value={formData.pinCode || ""}
                                            autoFocus 
                                            onChange={(e)=>handleUpdataInfo(e,"pincode")} 
                                        />
                                    ) : (
                                        <motion.p
                                            variants={subVarients2}
                                        >
                                        {authUser.pinCode} 
                                        </motion.p>
                                    )
                                }
                            </div> 
                            <button className="EditIcon size-4 cursor-pointer" onClick={()=> setIsPincodeEdit(!isPincodeEdit)}>
                              <img className="EditIcon" src={editIcon}/>
                            </button>
                        </motion.div> 
                    </motion.li>
                    <motion.li 
                        className="w-full flex justify-between border-b-[1px] border-b-black sm:sm:px-5"
                        variants={constVarients}
                    >
                        <motion.h3
                            variants={subVarients1}
                        >Email</motion.h3>
                        <motion.p
                            variants={subVarients2}
                        >
                           {authUser.email} 
                        </motion.p>
                    </motion.li>
                     
                    <motion.li className="w-full flex items-center justify-between border-b-[1px] border-b-black sm:px-5" variants={constVarients}>
                    <motion.h3
                            variants={subVarients1}
                        >Mobile No</motion.h3>
                        <motion.div className="flex items-center gap-3" variants={subVarients2}>
                            <div>
                                {
                                    isMobileEdit ? (
                                        <input 
                                            className="Edit outline-none border-b-[1px] w-[10vw]"
                                            type="text" 
                                            placeholder={`${formData.mobile ? '': "+91 "}`}
                                            value={formData.mobile || ""}
                                            autoFocus 
                                            onChange={(e)=>handleUpdataInfo(e,"mobile")} 
                                        />
                                    ) : (
                                        <motion.p
                                            variants={subVarients2}
                                        >
                                        {authUser.mobile} 
                                        </motion.p>
                                    )
                                }
                            </div> 
                            <button className="EditIcon size-4 cursor-pointer" onClick={()=> setisMobileEdit(!isMobileEdit)}>
                              <img className="EditIcon" src={editIcon}/>
                            </button>
                        </motion.div> 
                    </motion.li>
                </motion.ul>
            </div>
        </div>
    )
} 
export default UpdateProfile