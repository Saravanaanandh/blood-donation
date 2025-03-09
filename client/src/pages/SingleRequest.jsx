 
import Navbar from "../components/Navbar.jsx" 
import { useEffect,useState} from "react"
import bannerImg from './../assets/banner.png'
import { CheckCheck, CheckCircle, Clock, DropletsIcon, Smartphone, X} from "lucide-react"
import profilePic from './../assets/user.png'
import ToggleButton from './../components/ToggleButton.jsx'  
import { useParams } from "react-router" 
import { useRecipientStore} from '../store/useRecipientStore.jsx'  
import { useNavigate } from "react-router"

const SingleRequest = () => { 

    const [showToggle, setShowToggle] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowToggle(true);  // Enable rendering after delay
        }, 1500);

        return () => clearTimeout(timer); // Cleanup on unmount
    }, []);
    const navigate = useNavigate()
    const {id:recipientId} = useParams()  
    const {getRequest,singleRecipient,acceptRequest, rejectRequest,UnsubscribeToGetRequest} = useRecipientStore()

    useEffect(()=>{
      getRequest(recipientId)

      return ()=>UnsubscribeToGetRequest()
    },[]) 
    console.log(singleRecipient)
    return (
        <div className="min-h-[100vh]">
            <Navbar/>
            <div className="relative rounded-lg w-full h-[25vh] sm:h-[40vh] bg-no-repeat bg-cover bg-center" style={{backgroundImage:`url(${ singleRecipient.recipientProfile?.banner || bannerImg})`}}>
                 
            </div>
            <div className="sm:sticky top-22">
            <div className="relative">
                <div className="absolute -top-10 sm:-top-20 left-5 sm:left-10 w-[80vw] sm:w-[25vw] max-sm:gap-5 h-auto sm:h-[60vh] rounded-md shadow-md bg-white shadow-gray-500 p-5 flex flex-col justify-between items-center">
                    <div className=" top-0 w-full flex justify-center">
                        <div className=" cursor-pointer relative inline-block"> 
                            <img className=" border-[1px] rounded-full size-23" src={  singleRecipient.recipientProfile?.profile || profilePic} alt="profile picture" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <h1 className="text-[1.2rem]"><strong>{ singleRecipient.recipientProfile?.username}</strong></h1>
                        <h1 className="">{ singleRecipient.recipientProfile?.email}</h1>
                        <div className="flex gap-3"> 
                            <span>Are You Available : </span>
                            {
                                !showToggle && (
                                    <ToggleButton 
                                        Available={singleRecipient.recipientProfile?.available}
                                        Id={singleRecipient.recipient?.recipientId}
                                    /> 
                                )
                            }
                            {
                                showToggle && (
                                    <ToggleButton 
                                        Available={singleRecipient.recipientProfile?.available}
                                        Id={singleRecipient.recipient?.recipientId}
                                    /> 
                                )
                            }
                        </div> 
                        <h1 className="flex gap-2 text-[1.2rem]">Donations : { singleRecipient.recipientProfile?.donation}<span className="text-red-600 "><DropletsIcon/></span></h1>
                    </div>
                </div> 
            </div> 
            </div>
            <div className="w-full flex flex-col items-center justify-center sm:w-4/6 absolute max-sm:top-[70vh] right-0 mt-6 sm:sm:px-5">
                <h1 className="text-[2rem] text-center"><strong>Patients Details</strong></h1>
                <h1>{singleRecipient.recipient?.isCritical ? (
                    <div className="p-1 px-2 mt-2 bg-red-600 text-white rounded-sm">
                        <strong>Emergency</strong> 
                    </div>
                ):""}</h1>
                <ul className="flex flex-col gap-4 w-3/4 my-10 leading-10">
                
                    <li className="w-full flex justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>Name</h3>
                        <p>
                           { singleRecipient.recipient?.patientsName} 
                        </p>
                    </li>
                    <li className="w-full flex justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>Age</h3>
                        <p>
                           { singleRecipient.recipient?.patientsage} 
                        </p>
                    </li>
                    <li className="w-full flex justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>Blood Type </h3>
                        <p>
                           {singleRecipient.recipient?.bloodType} 
                        </p>
                    </li>
                    <li className="w-full flex justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>Required Blood Units </h3>
                        <p>
                           {singleRecipient.recipient?.bloodUnits} 
                        </p>
                    </li>
                    <li className="w-full flex justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>Gender</h3>
                        <p>
                           {singleRecipient.recipient?.gender} 
                        </p>
                    </li>
                    <li className="w-full flex justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>Person Last Donated Date :</h3>
                        <p>
                           {singleRecipient.recipientProfile?.lastDonated || "No donations!"} 
                        </p>
                    </li>
                    {
                        singleRecipient.recipientProfile?.nextDonationDate ? (
                            <li className="w-full flex justify-between border-b-[1px] border-b-black sm:px-5">
                                <h3>Suggest to Donate After (90days) </h3>
                                <p>
                                {singleRecipient.recipientProfile?.nextDonationDate} 
                                </p>
                            </li>
                        ) : ("")
                    } 
                    <li className="w-full flex items-center justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>Location</h3>
                        <p>
                           {singleRecipient.recipient?.location} 
                        </p>
                    </li>
                    <li className="w-full flex items-center justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>PinCode</h3> 
                        <p>
                           {singleRecipient.recipient?.pinCode} 
                        </p>
                    </li>
                    <li className="w-full flex justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>Email</h3>
                        <p>
                           {singleRecipient.recipient?.email} 
                        </p>
                    </li>
                     
                    <li className="w-full flex items-center justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>Attendees Name</h3> 
                        <p>
                          {singleRecipient.recipient?.AttendeesName} 
                        </p>
                    </li>
                    <li className="w-full flex items-center justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>Attendees Mobile Number</h3> 
                        <p>
                          {singleRecipient.recipient?.AttendeesPhno} 
                        </p>
                    </li>
                </ul>
                <div className="mb-10">
                    {
                        singleRecipient.requestDetail?.status === "pending" ? (
                        <div className="mb-10 flex gap-5">
                            <button 
                                className="cursor-pointer" 
                                onClick={()=>{
                                    rejectRequest(recipientId);
                                    navigate('/allrequests')
                                }}
                            > 
                            <div className="px-4 py-2 rounded-sm text-red-600 border-[1px] flex gap-2 transition-all duration-300 hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-md hover:shadow-red-800">
                                Reject <X/>
                            </div> 
                            </button>
                            <button 
                                className="cursor-pointer" 
                                onClick={()=>{
                                    acceptRequest(recipientId);
                                    navigate('/allrequests')
                                }}
                            >  
                                <div className="px-4 py-2 rounded-sm text-green-600 border-[1px] flex gap-2 transition-all duration-300 hover:bg-green-600 hover:text-white hover:border-green-600 hover:shadow-md hover:shadow-green-800">
                                    Accept <CheckCheck/>
                                </div>
                            </button>
                        </div>
                        ) :  singleRecipient.requestDetail?.status === "accepted" ? (
                            <span  className="px-4 py-2 rounded-sm flex gap-2  bg-yellow-600 text-white border-yellow-600 shadow-md shadow-yellow-800">Waiting <Clock/></span>
                        ) :
                        singleRecipient.requestDetail?.status === "confirmed" ? 
                        <span 
                            className="cursor-pointer flex items-center gap-1 px-3 py-2 rounded-sm  bg-green-700 text-white shadow-md shadow-green-800"
                            onClick={()=>navigate(`/${singleRecipient.recipient?.recipientId}/otp`)}
                        >
                            Generate OTP <Smartphone/>
                        </span>:<span  className="px-4 py-2 rounded-sm flex gap-2  bg-green-600 text-white border-green-600 shadow-md shadow-green-800">Completed <CheckCircle/></span>  
                    } 
                </div>
            </div>
        </div>
    )
} 
export default SingleRequest