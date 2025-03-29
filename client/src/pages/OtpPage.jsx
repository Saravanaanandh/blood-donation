import { useState, useEffect } from "react";
import { useRecipientStore } from "../store/useRecipientStore.jsx";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router"; 
import { Loader2Icon } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const OtpPage = () => {
  const { sendOtp, OtpDetail, verifyOtp,isOtpVerified,setOtpDetail,isSendingOtp,isVerifyOtp,getRequest,singleRecipient } = useRecipientStore();
  const navigate = useNavigate();
  const {id:recipientId} = useParams()
  useEffect(() => {
    getRequest(recipientId)
    if (isOtpVerified) {
      setOtpDetail(null); // Reset OTP detail after verification
      navigate('/profile'); // Navigate after OTP is verified
    }
  }, [getRequest,recipientId,isOtpVerified, navigate, setOtpDetail]);
  const [email, setEmail] = useState(singleRecipient.recipient?.email);
  const [otp, setOtp] = useState("");

  console.log(singleRecipient)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendOtp({ email });
    } catch (err) {
      console.log(err);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter OTP!");
    if (otp.length !== 6) return toast.error("Enter valid OTP");
    try {
      await verifyOtp({ otp ,recipientId}); 
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96 animate-fade-in-up">
        {!OtpDetail ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-center">Enter Your Email</h2>
            <input
              type="email"
              placeholder="Enter Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
              disabled={isSendingOtp}
            >
              {isSendingOtp?(<div className="flex justify-center items-center gap-2"><Loader2Icon className="animate-spin"/><span>sending...</span></div>):"Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-center">Enter OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* <InputOTP 
              maxLength={6}
              value={otp}
              onChange={(value) => {
                  setOtp(value); 
                  console.log("Current OTP:", value);
              }}
            >
              <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP> */}
            <button
              type="submit"
              onClick={handleOtpSubmit}
              className="bg-green-500 text-white py-2 px-5 rounded-lg hover:bg-green-600 transition-all duration-300"
              disabled={isVerifyOtp}
            >
              {isVerifyOtp?(<div className="flex justify-center items-center gap-2"><Loader2Icon className="animate-spin"/><span>verifying...</span></div>):"Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}; 
export default OtpPage;
