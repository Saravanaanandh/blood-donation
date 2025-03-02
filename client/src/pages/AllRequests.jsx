import { Link} from "react-router"
import { useRecipientStore } from "../store/useRecipientStore.jsx"
import { useEffect, useState } from "react"
import Navbar from "../components/Navbar.jsx"
import { motion } from "framer-motion"
import { CheckCheck, MoveRight, X } from "lucide-react"
import profilePic from './../assets/user.png'

const AllRequests = () => {

    const {allRequests, recipients, getRequest} = useRecipientStore()

    const [isRequests, setIsRequests] = useState(false)
    const [isConfirmedRequests, setIsConfirmedRequests] = useState(false)
    const [isRejectedRequests, setIsRejectedRequests] = useState(false)

    const pendingRequests = recipients.filter(recipient => recipient.request.status === "pending")

    const confirmedRequests = recipients.filter(recipient => recipient.request.status === "accepted")
    const rejectedRequests = recipients.filter(recipient => recipient.request.status === "rejected")

    useEffect(()=>{
       allRequests()
    },[allRequests])
      
  return ( 
    <div>
        <Navbar/>
        <h1 className="text-center text-red-600 text-[1.2rem] underline"><strong>All Requests</strong></h1>
        <div className="flex border-[1px] rounded-lg shadow-sm shadow-gray-400 mx-5 my-1 overflow-y-hidden">
            <div className="flex flex-col h-[75vh] w-[15vw]">
                <div className="cursor-pointer w-full m-3 flex h-[18vh] items-center justify-center rounded-lg shadow-sm shadow-gray-400" onClick={()=>{ setIsRequests(true);
                setIsConfirmedRequests(false);
                setIsRejectedRequests(false)
                }}>
                    <span className="text-[1.2rem]">Requests</span>
                </div> 
                <div className="cursor-pointer w-full m-3 flex h-[18vh] items-center justify-center rounded-lg shadow-sm shadow-gray-400" onClick={()=> {setIsConfirmedRequests(true);
                setIsRequests(false)
                setIsRejectedRequests(false)}
                }>
                    <span className="text-[1.2rem]">Accepted</span>
                </div>
                <div className="cursor-pointer w-full m-3 flex h-[18vh] items-center justify-center rounded-lg shadow-sm shadow-gray-400" onClick={()=> {setIsConfirmedRequests(false);
                setIsRequests(false);
                setIsRejectedRequests(true)
                }
                }>
                    <span className="text-[1.2rem]">Rejected</span>
                </div>
            </div>
            <motion.div 
                className="w-full h-full flex flex-col gap-3 mx-5 p-5 overflow-y-hidden"
                initial={{
                    transform:'translateY(200%)',
                    opacity:0
                }}
                animate={{
                    transform:'translateY(0px)',
                    opacity:1
                }}
                transition={{type:'spring', duration:2, delay:1}}
            >
                {
                    !isRequests && !isConfirmedRequests && !isRejectedRequests && (
                        <div className="w-full flex flex-col gap-3 justify-center items-center overflow-y-hidden">
                            <motion.h1 className="font-bold text-[1.2rem] font-mono text-center">📌 Menu Instructions</motion.h1>
                            <div className="w-full flex flex-col gap-3"> 
                                <motion.div 
                                    className="w-full border-[1px] rounded-md shadow-sm shadow-gray-400"
                                    initial={{
                                        transform: "translateY(200%)",
                                        opacity: 0,
                                        scale:0
                                    }}
                                    animate={{
                                        transform: "translateY(0px)",
                                        opacity: 1,
                                        scale:1
                                    }}
                                    transition={{ type: "spring", duration: 1.2, delay: 1 }} 
                                >
                                    <h2>🩸 Request Blood</h2>
                                    <p>🔹 Click the <b>&quot;Request&quot;</b> button to submit a blood request.</p>
                                    <p>🔹 Provide accurate details, including blood type, required units, and hospital/location</p>
                                    <p>🔹 Ensure your contact information is correct for a quick response.</p> 
                                </motion.div>
                        
                                <motion.div 
                                    className="w-full border-[1px] rounded-md shadow-sm shadow-gray-400"
                                    initial={{
                                        transform: "translateY(200%)",
                                        opacity: 0,
                                        scale:0
                                    }}
                                    animate={{
                                        transform: "translateY(0px)",
                                        opacity: 1,
                                        scale:1
                                    }}
                                    transition={{ type: "spring", duration: 1.1, delay: 1.4 }} 
                                >
                                    <h2>✅ Confirm Donation(Pending Confirmation)</h2>
                                    <p>🔹 Once a donor has been assigned, click the <b>&quot;Confirm&quot;</b> button to acknowledge receipt.</p>
                                    <p>🔹 This helps update the system and allows others to request assistance.</p> 
                                </motion.div>
                        
                                <motion.div 
                                    className="w-full border-[1px] rounded-md shadow-sm shadow-gray-400"
                                    initial={{
                                        transform: "translateY(200%)",
                                        opacity: 0,
                                        scale:0
                                    }}
                                    animate={{
                                        transform: "translateY(0px)",
                                        opacity: 1,
                                        scale:1
                                    }}
                                    transition={{ type: "spring", duration: 1, delay: 1.6 }} 
                                >
                                    <h2>🎉 Accepted (Request Approved)</h2>
                                    <p>🔹 Your request has been accepted!</p>
                                    <p>🔹 You will receive donor details and further instructions.</p>
                                    <p>🔹 Please contact the donor to coordinate the donation.</p>
                                    <p>🔹 Follow safety and health guidelines before donation.</p>
                                </motion.div>
                            </div>
                        </div>
                    )
                }
                {
                    isRequests && !pendingRequests.length && (
                        <div className="w-full h-full flex justify-center items-center">
                            <span>No Requests !</span>
                        </div>
                    )
                }
                { isRequests && pendingRequests.length>0 && (
                    pendingRequests.map((recipient)=>(
                        <Link className="w-full h-[15vh] shadow-sm shadow-gray-500 rounded-md px-5 hover:border-[1px] transition-all duration-100" key={recipient.request._id} onClick={()=> getRequest(recipient.request.recipientId)} to={`/allrequests/${recipient.request.recipientId}`}>
                            <div className="h-full flex justify-between items-center">
                                <div className="flex items-center gap-5">
                                    <div>
                                        <img className="size-15 rounded-full " src={recipient.recipientProfile.profile || profilePic} alt="" />
                                    </div>
                                    <div> 
                                        <h1><strong> {recipient.recipientProfile.username.toUpperCase()}</strong></h1>
                                        <p className="text-[0.9rem]"> Age : {recipient.requestDetail.patientsage} | Gender : {recipient.requestDetail.gender} | location : {recipient.requestDetail.location} </p>
                                    </div>
                                </div>
                                <div>
                                    <button className="flex items-center gap-1 px-3 py-2 border-[1px] transition-all duration-200 rounded-sm text-green-700 hover:bg-green-700 hover:text-white">
                                        Accept <MoveRight className="size-4"/>
                                    </button>
                                </div>
                            </div> 
                        </Link>
                    ))
                )} 
                {
                    isConfirmedRequests && !confirmedRequests.length && (
                        <div className="w-full h-full flex justify-center items-center">
                            <span>No History of Confirmed Requests!</span>
                        </div>
                    )
                }
                {
                    isConfirmedRequests && confirmedRequests.length>0 && (
                        confirmedRequests.map((recipient)=>(
                            <Link className="w-full h-[15vh] shadow-sm shadow-gray-500 rounded-md px-5 hover:border-[1px] transition-all duration-100" key={recipient.request._id} onClick={()=> getRequest(recipient.request.recipientId)} to={`/allrequests/${recipient.request.recipientId}`}>
                                <div className="h-full flex justify-between items-center">
                                    <div className="flex items-center gap-5">
                                        <div>
                                            <img className="size-15 rounded-full " src={recipient.recipientProfile.profile || profilePic} alt="" />
                                        </div>
                                        <div> 
                                            <h1><strong> {recipient.recipientProfile.username.toUpperCase()}</strong></h1>
                                            <p className="text-[0.9rem]"> Age : {recipient.requestDetail.patientsage} | Gender : {recipient.requestDetail.gender} | location : {recipient.requestDetail.location} </p>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="flex items-center gap-1 px-3 py-2 rounded-sm  bg-green-700 text-white">
                                            Accepted <CheckCheck/>
                                        </button>
                                    </div>
                                </div> 
                            </Link>
                        ))
                    )
                }
                {
                    isRejectedRequests && !rejectedRequests.length && (
                        <div className="w-full h-full flex justify-center items-center">
                            <span>No History of Rejected Requests!</span>
                        </div>
                    )
                }
                {
                    isRejectedRequests && rejectedRequests.length>0 && (
                        rejectedRequests.map((recipient)=>(
                            <Link className="w-full h-[15vh] shadow-sm shadow-gray-500 rounded-md px-5 hover:border-[1px] transition-all duration-100" key={recipient.request._id} onClick={()=> getRequest(recipient.request.recipientId)} to={`/allrequests/${recipient.request.recipientId}`}>
                                <div className="h-full flex justify-between items-center">
                                    <div className="flex items-center gap-5">
                                        <div>
                                            <img className="size-15 rounded-full " src={recipient.recipientProfile.profile || profilePic} alt="" />
                                        </div>
                                        <div> 
                                            <h1><strong> {recipient.recipientProfile.username.toUpperCase()}</strong></h1>
                                            <p className="text-[0.9rem]"> Age : {recipient.requestDetail.patientsage} | Gender : {recipient.requestDetail.gender} | location : {recipient.requestDetail.location} </p>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="flex items-center gap-1 px-3 py-2 rounded-sm bg-red-700  text-white">
                                            Rejected <X/>
                                        </button>
                                    </div>
                                </div> 
                            </Link>
                        ))
                    )
                }
            </motion.div>
        </div>
    </div>
  )
}

export default AllRequests