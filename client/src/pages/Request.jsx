import { useState } from "react" 
import { useRecipientStore } from "../store/useRecipientStore.jsx"
import toast from "react-hot-toast"
import Navbar from "../components/Navbar.jsx"
import requestImg from './../assets/Request Form.jpg' 
import { useNavigate } from "react-router"
const Request = () => {
    const navigate = useNavigate()
    const [isChecked, setIsChecked] = useState(false)
    const [formData, setFormData] = useState({
        bloodType:"",
        patientsName:"",
        patientsage:"",
        AttendeesName:"",
        AttendeesPhno:"",
        gender:"",
        email:"",
        location:"",
        pinCode:"",
        reqDate:"",
        bloodUnits:"",
        isCritical:isChecked,
        note:""
    })
    const {createRecipient} = useRecipientStore()

    const handleSubmit = async (e)=>{
        e.preventDefault()

        if(!formData.bloodType || !formData.patientsName || !formData.patientsage || !formData.AttendeesName || !formData.AttendeesPhno || !formData.gender || !formData.email || !formData.location || !formData.pinCode || !formData.reqDate || !formData.bloodUnits) return toast.error("please fill the required fields!, because it more helpful for donors")

        try{
            await createRecipient(formData)
        }catch(err){
            console.log(err.message)
        }
        setFormData({
            bloodType:"",
            patientsName:"",
            patientsage:"",
            AttendeesName:"",
            AttendeesPhno:"",
            gender:"",
            email:"",
            location:"",
            pinCode:"",
            reqDate:"",
            bloodUnits:"",
            isCritical:isChecked,
            note:""
        })
        navigate('/alldonors')
    }
  return (
    <div className="bg-fixed bg-no-repeat bg-right bg-contain min-h-[100vh]">
        <div className="relative">
            <img className="absolute -z-10 sm:right-20 sm:top-36 cover center w-[30vw] right-0 top-[24vh]" src={requestImg} alt="blood donation picture" />
        </div>
        <Navbar/>
        <h1 className="pl-10 text-[2rem] text-red-500"><strong>Request for Blood 🩸</strong></h1>
        <form onSubmit={handleSubmit} className="my-15 flex flex-col gap-10 px-10">
            <div className="w-full flex gap-5">
            <div className="w-1/4 flex flex-col gap-5">
                <select
                    onChange={(e)=> setFormData({...formData, bloodType:e.target.value})} 
                    className="border-[1px] border-black rounded-sm outline-none bg-white px-2 py-1"
                    required
                >
                    <option>select bloodType</option>
                    <option value={"A+"}>A+</option>
                    <option value={"A-"}>A-</option>
                    <option value={"B+"}>B+</option>
                    <option value={"B-"}>B-</option>
                    <option value={"O+"}>O+</option>
                    <option value={"O-"}>O-</option>
                    <option value={"AB+"}>AB+</option>
                    <option value={"AB-"}>AB-</option>
                </select>
                <input 
                    type="text" 
                    className="border-[1px] border-black rounded-sm outline-none bg-white px-2 py-1"
                    placeholder="patient's Name"
                    value={formData.patientsName}
                    onChange={(e)=> setFormData({...formData, patientsName:e.target.value})}
                    required
                />
                <input 
                    type="text" 
                    className="border-[1px] border-black rounded-sm outline-none bg-white px-2 py-1"
                    placeholder="Attendees's Name"
                    value={formData.AttendeesName}
                    onChange={(e)=> setFormData({...formData, AttendeesName:e.target.value})}
                    required
                />
                <select
                    className="border-[1px] border-black rounded-sm outline-none bg-white px-2 py-1"
                    onChange={(e)=> setFormData({...formData, gender:e.target.value})}  
                    required
                >
                    <option>select Gender</option>
                    <option value={"MALE"}>Male</option>
                    <option value={"FEMALE"}>Female</option> 
                </select>
                <input 
                    type="text" 
                    className="border-[1px] border-black rounded-sm outline-none bg-white px-2 py-1"
                    placeholder="Enter location"
                    value={formData.location}
                    onChange={(e)=> setFormData({...formData, location:e.target.value})}
                    required
                /> 
                <input 
                    type="email" 
                    className="border-[1px] border-black rounded-sm outline-none bg-white px-2 py-1"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e)=> setFormData({...formData, email:e.target.value})}
                    required
                /> 

                <div className="flex gap-3">
                    <input 
                        type="checkbox" 
                        className="w-[15px]"
                        checked={isChecked}
                        onChange={()=> setIsChecked(!isChecked)}
                    /> <span>isCritical</span>
                </div> 
                <textarea
                    type="text" 
                    className="border-[2px] border-black min-h-[50px] max-h-[150px] outline-none rounded-sm"
                    placeholder="Additional note to potential donors"
                    value={formData.note}
                    onChange={(e)=> setFormData({...formData, note:e.target.value})}  
                    
                >
                </textarea>
            </div>
            <div className="relative w-1/4 flex flex-col gap-5 mt-[52px]">
            
            <input 
                type="text" 
                className="border-[1px] border-black rounded-sm outline-none bg-white px-2 py-1"
                placeholder="patient's Age"
                value={formData.patientsage}
                onChange={(e)=> setFormData({...formData, patientsage:parseInt(e.target.value)})}
                required
            />
            
            <input 
                type="tel" 
                className="border-[1px] border-black rounded-sm outline-none bg-white px-2 py-1"
                placeholder="Attendee's Phone no."
                value={formData.AttendeesPhno}
                onChange={(e)=> setFormData({...formData, AttendeesPhno:parseInt(e.target.value)})}
                required
            />  
            <input 
                type="date" 
                className="border-[1px] border-black rounded-sm outline-none bg-white px-2 py-1"
                placeholder="required date"
                value={formData.reqDate}
                onChange={(e)=> setFormData({...formData, reqDate:e.target.value})} 
            />
            <input 
                type="text"
                className="border-[1px] border-black rounded-sm outline-none bg-white px-2 py-1"
                placeholder="Enter pincode"
                value={formData.pinCode}
                onChange={(e)=> setFormData({...formData, pinCode:parseInt(e.target.value)})}
                required
            />
            <input 
                type="number" 
                className="border-[1px] border-black rounded-sm outline-none bg-white px-2 py-1"
                placeholder="select no.of units"
                value={formData.bloodUnits}
                onChange={(e)=> setFormData({...formData, bloodUnits:e.target.value})}
                required
            /> 
            <button className="absolute bottom-0 -right-5 rounded-sm cursor-pointer bg-red-500 px-5 py-1 text-white" type="submit" onClick={handleSubmit}>
                Request for a Blood
            </button>
            </div>
            </div>
            
        </form>
    </div>
  )
}

export default Request