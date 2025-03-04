import { Link } from "react-router" 
import { useRecipientStore } from "../store/useRecipientStore.jsx"
import Navbar from "../components/Navbar.jsx"
import { useAuthStore } from "../store/useAuthStore.jsx"
import { useRef, useState } from "react"
import bannerImg from './../assets/banner.png'
import { Camera, DropletsIcon, Edit } from "lucide-react"
import profilePic from './../assets/user.png'
import ToggleButton from './../components/ToggleButton.jsx'
import editIcon from './../assets/editpng.png'


const UpdateProfile = () => { 

    const {authUser, updateProfile} = useAuthStore()
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
                // if(formData.mobile !== e.target.value){
                    await updateProfile(formData)
                    setisMobileEdit(false)  
                // } 
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
            // setFormData({...formData, mobile:parseInt(e.target.value)}) 
            setFormData({...formData, location:e.target.value}) 
            return;
        }
        if(data === "mobile"){
            setFormData({...formData, mobile:parseInt(e.target.value)})  
            return;
        }
        if(data === "pincode"){
            setFormData({...formData, pinCode:parseInt(e.target.value)})  
            return;
        }
    }
    return (
        <div className="min-h-[100vh]" onClick={handleEditToggle}>
            <Navbar/>
            <div className="relative rounded-lg w-full h-[40vh] bg-no-repeat bg-cover bg-center" style={{backgroundImage:`url(${banner || authUser.banner || bannerImg})`}}>
                <input 
                    type="file"
                    ref={bannerRef}
                    className="hidden"
                    accept="/image*"
                    onChange={handleImageChange}  
                />
                <div className="cursor-pointer absolute p-1 bg-gray-300 rounded-full bottom-2 right-2 hover:text-white transition-colors duration-300 ease-in-out" onClick={()=>bannerRef.current?.click()}>
                    <Edit className="size-5"/>
                </div>
            </div>
            <div className="sticky top-22">
            <div className="relative">
                <div className="absolute -top-20 left-10 w-[25vw] h-[60vh] rounded-md shadow-md bg-white shadow-gray-500 p-5 flex flex-col justify-between items-center">
                    <div className=" top-0 w-full flex justify-center">
                        <div className=" cursor-pointer relative inline-block"> 
                            <input 
                                type="file" 
                                className="hidden"
                                ref={profileRef}
                                accept="/image*"
                                onChange={handleProfileImageChange}
                            />
                            <Camera onClick={()=> profileRef.current.click()} className="p-1 size-6 bg-gray-300 rounded-full absolute bottom-0 right-0 "/>
                            <img className=" border-[1px] rounded-full size-23" src={profile || authUser.profile || profilePic} alt="profile picture" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <h1 className="text-[1.2rem]"><strong>{authUser.username}</strong></h1>
                        <h1 className="">{authUser.email}</h1>
                        <div className="flex gap-3"> 
                            <span>Are You Available : </span>
                            <ToggleButton 
                                Available={authUser?.available}
                            />
                        </div> 
                        <h1 className="flex gap-2 text-[1.2rem]">Donations : {authUser.donation}<span className="text-red-600 "><DropletsIcon/></span></h1>
                    </div>
                    <div className="w-full flex flex-col gap-2"> 
                        <Link to='/allrequests'>
                            <button className="cursor-pointer w-full py-1.5   rounded-md text-red-500 border-[1px] border-red-500">
                                My recipients
                            </button>
                        </Link>
                        <Link to='/alldonors'>
                            <button className="cursor-pointer w-full py-1.5 bg-red-500 rounded-md text-white" onClick={allRequests}>
                                My Request
                            </button>
                        </Link> 
                    </div>
                </div> 
            </div> 
            </div>
            <div className="flex flex-col items-center justify-center w-4/6 absolute right-0 mt-6 px-5">
                <h1 className="text-[2rem] text-center"><strong>Profile</strong></h1>
                <ul className="flex flex-col gap-5 w-3/4 my-10 leading-10">
                    <li className="w-full flex justify-between border-b-[1px] border-b-black px-5">
                        <h3>Age</h3>
                        <p>
                           {authUser.age} 
                        </p>
                    </li>
                    <li className="w-full flex justify-between border-b-[1px] border-b-black px-5">
                        <h3>Blood Type </h3>
                        <p>
                           {authUser.bloodType} 
                        </p>
                    </li>
                    <li className="w-full flex justify-between border-b-[1px] border-b-black px-5">
                        <h3>Lastly Donated Date :</h3>
                        <p>
                           {authUser.lastDonated ? new Date(authUser.lastDonated).toISOString().split('T')[0] : "No donations!"} 
                        </p>
                    </li>
                    {
                        authUser.nextDonationDate ? (
                            <li className="w-full flex justify-between border-b-[1px] border-b-black px-5">
                                <h3>Suggest to Donate After(90days)</h3>
                                <p>
                                {new Date(authUser.nextDonationDate).toISOString().split('T')[0]}
                                </p>
                            </li>
                        ) : ("")
                    } 
                    <li className="w-full flex justify-between border-b-[1px] border-b-black px-5">
                        <h3>Gender</h3>
                        <p>
                           {authUser.gender} 
                        </p>
                    </li>
                    <li className="w-full flex items-center justify-between border-b-[1px] border-b-black px-5">
                        <h3>Location</h3> 
                        <div className="flex items-center gap-3">
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
                                        <p>{authUser.location}</p>
                                    )
                                }
                            </div> 
                            <button className="EditIcon size-4 cursor-pointer" onClick={()=> setIsLocationEdit(!isLocationEdit)}>
                              <img className="EditIcon" src={editIcon}/>
                            </button>
                        </div> 
                    </li>
                    <li className="w-full flex items-center justify-between border-b-[1px] border-b-black px-5">
                        <h3>PinCode</h3> 
                        <div className="flex items-center gap-3">
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
                                        <p>{authUser.pinCode}</p>
                                    )
                                }
                            </div> 
                            <button className="EditIcon size-4 cursor-pointer" onClick={()=> setIsPincodeEdit(!isPincodeEdit)}>
                              <img className="EditIcon" src={editIcon}/>
                            </button>
                        </div> 
                    </li>
                    <li className="w-full flex justify-between border-b-[1px] border-b-black px-5">
                        <h3>Email</h3>
                        <p>
                           {authUser.email} 
                        </p>
                    </li>
                     
                    <li className="w-full flex items-center justify-between border-b-[1px] border-b-black px-5">
                        <h3>Mobile Number</h3> 
                        <div className="flex items-center gap-3">
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
                                        <p>{authUser.mobile}</p>
                                    )
                                }
                            </div> 
                            <button className="EditIcon size-4 cursor-pointer" onClick={()=> setisMobileEdit(!isMobileEdit)}>
                              <img className="EditIcon" src={editIcon}/>
                            </button>
                        </div> 
                    </li>
                </ul>
            </div>
        </div>
    )
} 
export default UpdateProfile