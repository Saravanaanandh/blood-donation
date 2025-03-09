import { Link } from "react-router";
import { useDonorStore } from "../store/useDonorStore.jsx";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import profilePic from "./../assets/user.png";
import { CheckCheck, CheckCircleIcon, Eye, SendHorizontalIcon, TriangleAlert } from "lucide-react"; 
import { useAuthStore } from "../store/useAuthStore.jsx";
import {motion} from 'framer-motion' 
import { useRecipientStore } from "../store/useRecipientStore.jsx";
const AllDonors = () => {
  const {authUser} = useAuthStore()
  const { allDonors, donors, getDonor,UnsubscribeToAlldonors } = useDonorStore(); 
  const {recipientId} = useRecipientStore()

  const [isAvailable, setIsAvailable] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  useEffect(() => {
    allDonors();

    return ()=>UnsubscribeToAlldonors()
  }, []);

  const availableDonors = donors.filter(
    (donor) =>{
      const isAvailable = donor.donorDetail?.available
      const isRecipientRequest = donor.requestDetail === null ? true :  false
      const isRecipientUser = recipientId === authUser._id ? true : false
      console.log(isAvailable & isRecipientRequest & isRecipientUser)

      return isAvailable & isRecipientRequest & isRecipientUser
    }
    
    // (donor.donorDetail?.available === true) & ((!donor.requestDetail?.status ? true : donor.requestDetail.recipientId !== authUser._id ? true:false) & (donor.requestDetail?.status !== "finalState" | donor.requestDetail?.status !== "confirmed" | donor.requestDetail?.status !== "accepted" | donor.requestDetail?.status !== "pending") & recipientIds.includes(authUser._id))
    //& (donor.requestDetail === null) //& recipientIds.includes(authUser._id)
  );
  console.log(availableDonors) 
  //   const availableDonors = donors.filter((donor) => {
  //     const isAvailable = donor.donorDetail?.available === true;
  //     const hasNoRequestOrNotForUser =
  //         !donor.requestDetail?.status || donor.requestDetail.recipientId !== authUser._id;
  //     const isRecipientValid = recipientIds.some(recipient => recipient === authUser._id);

  //     return isAvailable && hasNoRequestOrNotForUser && isRecipientValid;
  // });


  const acceptedDonors = donors.filter(
    (donor) => ((donor.requestDetail?.status === "finalState") | (donor.requestDetail?.status === "confirmed")) & (donor.requestDetail?.recipientId === authUser._id)
  );
  const pendingRequests = donors.filter(
    (donor) => ((donor.requestDetail?.status === "pending") | (donor.requestDetail?.status === "accepted")) & (donor.requestDetail?.recipientId === authUser._id)
  );


  return (
    <div>
      <Navbar />
      <h1 className="text-center text-red-600 text-[1.2rem] underline">
        <strong>All Donors</strong>
      </h1>
      <div className="min-h-svh flex max-sm:flex-col border-[1px] rounded-lg shadow-sm shadow-gray-400 mx-5 my-1 overflow-y-hidden">
        <div className="flex sm:flex-col sm:h-[75vh] sm:w-[15vw] w-full">
          <div
            className="text-[1rem] sm:text-[1.2rem] cursor-pointer w-full m-3 flex h-[8vh] sm:h-[18vh] items-center justify-center rounded-lg shadow-sm shadow-gray-400"
            onClick={() => {
              setIsAvailable(true);
              setIsAccepted(false);
              setIsPending(false);
            }}
          >
            <span className="">Available</span>
          </div>
          <div
            className=" text-[1rem] sm:text-[1.2rem] cursor-pointer w-full m-3 flex h-[8vh] sm:h-[18vh] items-center justify-center rounded-lg shadow-sm shadow-gray-400"
            onClick={() => {
              setIsAvailable(false);
              setIsAccepted(false);
              setIsPending(true);
            }}
          >
            <span className="flex text-center">Request Sent</span>
          </div>
          <div
            className="text-[1rem] sm:text-[1.2rem] cursor-pointer w-full m-3 flex h-[8vh] sm:h-[18vh] items-center justify-center rounded-lg shadow-sm shadow-gray-400"
            onClick={() => {
              setIsAvailable(false);
              setIsAccepted(true);
              setIsPending(false);
            }}
          >
            <span className="">Accepted</span>
          </div>
        </div>
        <motion.div
          className={`w-full h-full flex flex-col gap-3 sm:mx-5 p-5 overflow-y-auto`}
          initial={{
            transform: "translateY(200%)",
            opacity: 0,
          }}
          animate={{
            transform: "translateY(0px)",
            opacity: 1,
          }}
          transition={{ type: "spring", duration: 2, delay: 1 }}
        >
          {!isAvailable && !isPending && !isAccepted && (
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
                    <h2>✅ Available (Donors or Blood Stock Available)</h2>
                    <p>🔹 Donors/Blood units are available in your selected location.</p>
                    <p>🔹 Click on a donors profile to view details and contact them.</p>
                    <p>🔹 You can directly send a request to an available donor.</p>
                    <p>🔹 If you find a match, proceed with the donation process.</p>
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
                    <h2>📨 Request Sent (Pending Confirmation)</h2>
                    <p>🔹 Your blood donation request has been successfully sent.</p>
                    <p>🔹 Please wait for the donor to respond to your request.</p>
                    <p>🔹 You can check the request status in your dashboard.</p>
                    <p>🔹 If no response within [X] hours, consider another donor.</p>
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
          )}
          {isAvailable && !availableDonors.length && (
            <div className="w-full h-full flex flex-col gap-5 justify-center items-center">
              <span>No Donors Available!</span>
              <p>Note: Please check if you have already filled out the Request Form.</p>
            </div>
          )}
          {isAvailable &&
            donors.length > 0 &&
            availableDonors.map((donor) => (
              <Link
                className="w-full h-[15vh] shadow-sm shadow-gray-500 rounded-md px-5 hover:border-[1px] transition-all duration-100"
                key={donor.donor._id}
                onClick={() => {
                  getDonor(donor.donor.donorId)
                }}
                to={`/alldonors/${donor.donor.donorId}`}
              >
                <div className="h-full flex max-sm:gap-10 sm:justify-between items-center">
                  <div className="flex items-center gap-5">
                    <div>
                      <img
                        className="size-15 rounded-full "
                        src={donor.donorDetail.profile || profilePic}
                        alt=""
                      />
                    </div>
                    <div className="max-sm:hidden">
                      <h1>
                        <strong>
                          {" "}
                          {donor.donorDetail.username.toUpperCase()}
                        </strong>
                      </h1>
                      <p className="text-[0.9rem]">
                        {" "}
                        Age : {donor.donorDetail.age} | Gender :{" "}
                        {donor.donorDetail.gender} | location :{" "}
                        {donor.donorDetail.location}{" "}
                      </p>
                    </div>
                  </div>
                  <div className="sm:flex sm:flex-col sm:items-center">
                    <h1 className="sm:hidden text-center">
                      <strong> 
                        {donor.donorDetail.username.toUpperCase()}
                      </strong>
                    </h1>
                    <button className="flex items-center gap-1 px-3 py-2 border-[1px] transition-all duration-200 rounded-sm text-green-700 hover:bg-green-700 hover:text-white">
                      Send Request <SendHorizontalIcon className="size-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          {isPending && !pendingRequests.length && (
            <div className="w-full h-full flex justify-center items-center">
              <span>No Requests are pending!</span>
            </div>
          )}
          {isPending &&
            pendingRequests.length > 0 &&
            pendingRequests.map((donor) => (
              <Link
                className="w-full h-[15vh] shadow-sm shadow-gray-500 rounded-md px-5 hover:border-[1px] transition-all duration-100"
                key={donor.donor._id}
                onClick={() => getDonor(donor.donor.donorId)}
                to={`/alldonors/${donor.donor.donorId}`}
              >
                <div className="h-full flex max-sm:gap-10 sm:justify-between items-center">
                  <div className="flex items-center gap-5">
                    <div>
                      <img
                        className="size-15 rounded-full "
                        src={donor.donorDetail.profile || profilePic}
                        alt=""
                      />
                    </div>
                    <div className="max-sm:hidden">
                      <h1>
                        <strong>
                          {" "}
                          {donor.donorDetail.username.toUpperCase()}
                        </strong>
                      </h1>
                      <p className="text-[0.9rem]">
                        {" "}
                        Age : {donor.donorDetail.age} | Gender :{" "}
                        {donor.donorDetail.gender} | location :{" "}
                        {donor.donorDetail.location}{" "}
                      </p>
                    </div>
                  </div>
                  <div className="sm:flex sm:flex-col sm:items-center">
                    <h1 className="sm:hidden text-center">
                      <strong> 
                        {donor.donorDetail.username.toUpperCase()}
                      </strong>
                    </h1>
                    <button className={`flex items-center gap-1 px-3 py-2 rounded-sm ${donor.requestDetail?.status === "pending" ? "bg-yellow-400 text-black":"bg-green-400 text-white"}`}>
                      {donor.requestDetail?.status === "accepted" ? "Confirm" : "Pending"} {donor.requestDetail?.status === "pending" ? (<TriangleAlert className="size-4" />):(<CheckCircleIcon className="size-4" />)}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          {isAccepted && !acceptedDonors.length && (
            <div className="w-full h-full flex justify-center items-center">
              <span>No Accepting Donors !</span>
            </div>
          )}
          {isAccepted &&
            acceptedDonors.length > 0 &&
            acceptedDonors.map((donor) => (
              <Link
                className="w-full h-[15vh] shadow-sm shadow-gray-500 rounded-md px-5 hover:border-[1px] transition-all duration-100"
                key={donor.donor._id}
                onClick={() => getDonor(donor.donor.donorId)}
                to={`/alldonors/${donor.donor.donorId}`}
              >
                <div className="h-full flex max-sm:gap-10 sm:justify-between items-center">
                  <div className="flex items-center gap-5">
                    <div>
                      <img
                        className="size-15 rounded-full "
                        src={donor.donorDetail.profile || profilePic}
                        alt=""
                      />
                    </div>
                    <div className="max-sm:hidden">
                      <h1>
                        <strong>
                          {" "}
                          {donor.donorDetail.username.toUpperCase()}
                        </strong>
                      </h1>
                      <p className="text-[0.9rem]">
                        {" "}
                        Age : {donor.donorDetail.age} | Gender :{" "}
                        {donor.donorDetail.gender} | location :{" "}
                        {donor.donorDetail.location}{" "}
                      </p>
                    </div>
                  </div>
                  <div className="sm:flex sm:flex-col sm:items-center">
                    <h1 className="sm:hidden text-center">
                      <strong> 
                        {donor.donorDetail.username.toUpperCase()}
                      </strong>
                    </h1>
                    <button className="flex items-center gap-1 px-3 py-2 rounded-sm bg-green-700 text-white">
                      {donor.requestDetail?.status === "confirmed" ? "view" : "Completed"}
                      {donor.requestDetail?.status === "confirmed" ? (<Eye/>):(<CheckCheck className="size-4" />)}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AllDonors;
