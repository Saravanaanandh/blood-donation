 
import Navbar from "../components/Navbar.jsx" 
import { useEffect,useState} from "react"
import bannerImg from './../assets/banner.png'
import { BadgeCheckIcon, CheckCheck, CheckCircle, Clock, DropletsIcon, Mail, SendHorizonal, TabletSmartphoneIcon, TriangleAlertIcon, X } from "lucide-react"
import profilePic from './../assets/user.png'
import ToggleButton from './../components/ToggleButton.jsx' 
import { useDonorStore } from "../store/useDonorStore.jsx"
import { useParams } from "react-router" 
import { useRecipientStore} from '../store/useRecipientStore.jsx'
import { useNavigate } from "react-router"  
import { useAuthStore } from "../store/useAuthStore.jsx"


const SingleDonor = () => { 

    const navigate = useNavigate()
    const {id:donorId} = useParams()  
    const {isUserAsRecipient} = useAuthStore()
    const {getDonor, singleDonor} = useDonorStore()
    const {sendRequest,rejectRequest, confirmRequest} = useRecipientStore()
    
    const [showToggle, setShowToggle] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowToggle(true); 
        }, 500);

        return () => clearTimeout(timer); 
    }, []);
    useEffect(() => { 
        getDonor(donorId);  
    }, [donorId]);
     

    console.log(singleDonor)
    const handleSendRequest = async(id)=>{
        
      await sendRequest(id)
      navigate('/alldonors')
    }
    console.log(isUserAsRecipient)
    return (
        <div className="min-h-[100vh]">
            <Navbar/>
            <div className="relative rounded-lg w-full h-[25vh] sm:h-[40vh] bg-no-repeat bg-cover bg-center" style={{backgroundImage:`url(${ singleDonor.donorDetail?.banner || bannerImg})`}}>
                 
            </div>
            <div className="sm:sticky top-22">
            <div className="relative">
                <div className="absolute -top-10 sm:-top-20 left-5 sm:left-10 w-[80vw] sm:w-[25vw] h-auto rounded-md shadow-md bg-white shadow-gray-500 p-5 flex flex-col gap-5 items-center">
                    <div className=" top-0 w-full flex justify-center">
                        <div className=" cursor-pointer relative inline-block"> 
                            <img className=" border-[1px] rounded-full size-23" src={ singleDonor.donorDetail?.profile || profilePic} alt="profile picture" />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-1">
                        <h1 className="text-[1.2rem]"><strong>{singleDonor.donorDetail?.username.toUpperCase()}</strong></h1>
                        <h1 className="">{singleDonor.donorDetail?.email}</h1>
                        <div className="flex gap-3"> 
                            <span> Available : </span>
                            {
                                !showToggle && (
                                    <ToggleButton 
                                        Available={singleDonor?.donorDetail?.available}
                                        Id={singleDonor.donor?._id}
                                    /> 
                                )
                            }
                            {
                                showToggle && (
                                    <ToggleButton 
                                        Available={singleDonor?.donorDetail?.available}
                                        Id={singleDonor.donor?._id}
                                    /> 
                                )
                            }
                        </div> 
                        <h1 className="flex gap-2 text-[1.2rem]">Donations : {singleDonor.donorDetail?.donation}<span className="text-red-600 "><DropletsIcon/></span></h1>
                    </div>
                </div> 
            </div> 
            </div>
            <div className="w-full flex flex-col items-center justify-center sm:w-4/6 absolute max-sm:top-[70vh] right-0 mt-6 sm:sm:sm:px-5">
                <h1 className="text-[2rem] text-center"><strong>Profile</strong></h1>
                <ul className="flex flex-col gap-5 sm:w-3/4 my-10 leading-10">
                    <li className="w-full flex justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>Age</h3>
                        <p>
                           {singleDonor.donorDetail?.age} 
                        </p>
                    </li>
                    <li className="w-full flex justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>Blood Type </h3>
                        <p>
                           {singleDonor.donorDetail?.bloodType} 
                        </p>
                    </li>
                    <li className="w-full flex justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>Gender</h3>
                        <p>
                           {singleDonor.donorDetail?.gender} 
                        </p>
                    </li>
                    <li className="w-full flex justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>Donor Last Donated Date :</h3>
                        <p>
                           {singleDonor.donorDetail?.lastDonated || "No donations!"} 
                        </p>
                    </li>
                    {
                        singleDonor.donorDetail?.nextDonate ? (
                            <li className="w-full flex justify-between border-b-[1px] border-b-black sm:px-5">
                                <h3>Suggest to Donate After (90days) </h3>
                                <p>
                                {singleDonor.donorDetail?.nextDonationDate} 
                                </p>
                            </li>
                        ) : ("")
                    } 
                    <li className="w-full flex items-center justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>Location</h3>
                        <p>
                           {singleDonor.donorDetail?.location} 
                        </p>
                    </li> 
                    <li className="w-full flex items-center justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>PinCode</h3> 
                        <p>
                           {singleDonor.donorDetail?.pinCode} 
                        </p>
                    </li>
                    <li className=" w-full flex justify-between border-b-[1px] border-b-black text-wrap flex-wrap sm:px-5">
                        <h3>Email</h3>
                        <p>
                           {singleDonor.donorDetail?.email} 
                        </p>
                    </li>
                     
                    <li className="w-full flex items-center justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>Mobile Number</h3> 
                        <p>
                          {singleDonor.donorDetail?.mobile} 
                        </p>
                    </li>
                    <li className="w-full flex items-center justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3>Previously Donate</h3> 
                        <p>
                          {(singleDonor.donor?.donatePre) === 'yes' ? 'Yes':'No'} 
                        </p>
                    </li>
                    <li className="w-full flex items-center justify-between border-b-[1px] border-b-black sm:px-5">
                        <h3 className="text-wrap">Last Six Month Acitivity</h3> 
                        <p>
                          {singleDonor.donor?.lastSixmonthActivity} 
                        </p>
                    </li>
                </ul>
                <button className="mb-10"> 
                  <div className="">
                    {singleDonor.requestDetail?.status === "prepending" ? (
                        <span className="shadow-sm shadow-yellow-700 px-4 py-2 rounded-sm flex gap-2 bg-yellow-500 text-black">
                            Pending <TriangleAlertIcon/>
                        </span>
                    ) : singleDonor.requestDetail?.status === "accepted" ? (
                        <div className="flex gap-5">
                            <span 
                                onClick={()=>{
                                    rejectRequest(singleDonor.requestDetail?._id);
                                    navigate('/alldonors')
                                }}  
                                className="cursor-pointer text-red-700 border-[1px] hover:shadow-sm hover:shadow-red-700 px-4 py-2 rounded-sm flex gap-2 hover:bg-red-700 hover:text-white items-center"
                            >
                                Reject <X/>
                            </span>
                            <span 
                                onClick={()=>{
                                    confirmRequest(singleDonor.requestDetail?._id);
                                    navigate('/alldonors')
                                }}  
                                className="cursor-pointer text-green-700 border-[1px] hover:shadow-sm hover:shadow-green-700 px-4 py-2 rounded-sm flex gap-2 hover:bg-green-700 hover:text-white items-center"
                            >
                                Confirm <CheckCircle/>
                            </span>
                        </div>
                    ) : singleDonor.requestDetail?.status === "pending" ? (
                        <span className=" shadow-sm shadow-yellow-700 px-4 py-2 rounded-sm flex gap-2 bg-yellow-700 text-white">
                            Waiting <Clock/>
                        </span>
                    ) : singleDonor.requestDetail?.status === "confirmed" ? (
                        <span className=" shadow-sm shadow-green-700 px-4 py-2 rounded-sm flex gap-2 bg-green-700 text-white">
                            Verify OTP<TabletSmartphoneIcon/>
                        </span>
                    ) : singleDonor.requestDetail?.status === "finalState" ? (
                        <span className="shadow-sm shadow-green-700 px-4 py-2 rounded-sm flex gap-2 bg-green-700 text-white">
                            Completed !<BadgeCheckIcon/>
                        </span>
                    ) : isUserAsRecipient == true ? (
                        <button 
                            disabled={!isUserAsRecipient}
                            onClick={()=>{ handleSendRequest(singleDonor.donorDetail?._id)}} 
                            className={`px-4 py-2 rounded-sm flex gap-2 ${isUserAsRecipient ? "cursor-pointer":"cursor-not-allowed"}  border-[1px] transition-all duration-300 text-green-700 hover:bg-green-700 hover:text-white`}
                        >
                            Send Request <SendHorizonal/>
                        </button>
                    ) :""
                    }
                  </div>
                </button>
            </div>
        </div>
    )
} 
export default SingleDonor