import { useState } from "react" 
import toast from "react-hot-toast"
import { useDonorStore } from "../store/useDonorStore.jsx"
import donoteImg from './../assets/Donate_form_bg.jpg'
import Navbar from "../components/Navbar.jsx"
import { useNavigate } from "react-router"

const Donate = () => {
    const navigate = useNavigate()
    const [isChecked, setIsChecked] = useState(false)
    const [formData, setFormData] = useState({
        fullname:"",
        dob:"",
        age:"",
        gender:"",
        bloodType:"",
        district:"",
        villageCity:"", 
        pinCode:"",
        mobile:"",
        email:"",
        donatePre:isChecked,
        lastSixmonthActivity:"", 
    })
    const {createDonor} = useDonorStore()

    const handleSubmit = async (e)=>{
        e.preventDefault()

        if(!formData.fullname || !formData.dob || !formData.age || !formData.bloodType || !formData.mobile || !formData.gender || !formData.email || !formData.district || !formData.villageCity || !formData.pinCode || !formData.lastSixmonthActivity) return toast.error("please fill the required fields!, because it more helpful for recipients")

        try{
            await createDonor(formData) 
        }catch(err){
            console.log(err.message)
        }
        setFormData({
            fullname:"",
            dob:"",
            age:"",
            gender:"",
            bloodType:"",
            district:"",
            villageCity:"", 
            pinCode:"",
            mobile:"",
            email:"",
            donatePre:isChecked,
            lastSixmonthActivity:"", 
        })
        navigate('/allrequests')
    }
  return (
    <div className="relative"> 
        <div className="pb-10 flex flex-col items-center w-full min-h-[100vh] bg-no-repeat bg-fixed bg-cover bg-center" style={{backgroundImage:`url(${donoteImg})`}}>
            <Navbar/>
            <div className="text-start mb-5">
                <h1 className="text-[2rem]"><strong>Blood Donation Consent Form</strong></h1> 
                <p>Your Donation is a Gift of Hop and Healing</p>
            </div>
            <form onSubmit={handleSubmit} className="w-3/5 flex flex-col gap-3  p-5 backdrop:blur-sm border-[1px] border-black rounded-2xl shadow-sm shadow-black">
                <input 
                    className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                    type="text" 
                    placeholder="fullname"
                    value={formData.fullname}
                    onChange={(e)=> setFormData({...formData, fullname:e.target.value})}
                    required
                />
                <input 
                    type="date" 
                    className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                    placeholder="Date of Birth"
                    value={formData.dob}
                    onChange={(e)=> setFormData({...formData, dob:e.target.value})} 
                />
                <input 
                    type="tel" 
                    className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                    placeholder={`${formData.age ? '': "Enter Age"}`}
                    value={formData.age || ""} 
                    onChange={(e)=> setFormData({...formData, age:parseInt(e.target.value)})}
                    required
                />
                <select
                    className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                    onChange={(e)=> setFormData({...formData, gender:e.target.value})}  
                    required
                >
                    <option>select Gender</option>
                    <option value={"MALE"}>Male</option>
                    <option value={"FEMALE"}>Female</option> 
                </select>
                <select
                    onChange={(e)=> setFormData({...formData, bloodType:e.target.value})} 
                    className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
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
                    className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                    placeholder="enter district"
                    value={formData.district}
                    onChange={(e)=> setFormData({...formData, district:e.target.value})}
                    required
                />
                <input 
                    type="text" 
                    className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                    placeholder="Enter village"
                    value={formData.villageCity}
                    onChange={(e)=> setFormData({...formData, villageCity:e.target.value})}
                    required
                />
                <input 
                    type="text" 
                    className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                    placeholder={formData.pinCode ? '': "Enter pincode"}
                    value={formData.pinCode || ""} 
                    onChange={(e)=> setFormData({...formData, pinCode:parseInt(e.target.value)})}
                    required
                /> 
                <input 
                    type="tel" 
                    className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                    placeholder={formData.mobile ? '': "phone number"}
                    value={formData.mobile || ""} 
                    onChange={(e)=> setFormData({...formData, mobile:parseInt(e.target.value)})}
                    required
                /> 
                <input 
                    className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                    type="email" 
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e)=> setFormData({...formData, email:e.target.value})}
                    required
                /> 
                <select
                    className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                    onChange={(e)=> setFormData({...formData, lastSixmonthActivity:e.target.value})}  
                    required
                >
                    <option>select :</option>
                    <option value={"tattooing"}>tattooing</option>
                    <option value={"piercing"}>piercing</option> 
                    <option value={"dental extraction"}>dental extraction</option> 
                    <option value={"no"}>no</option> 
                </select> 
                <div className="ml-[5vw] w-full flex gap-5">
                    <input 
                        type="checkbox" 
                        className="px-5" 
                        checked={isChecked}
                        onChange={()=> {
                            setIsChecked(!isChecked)
                            setFormData({...formData, donatePre:isChecked})
                        }}
                        required
                    /> 
                    <span>Donate previously</span>
                </div>  
                

                <button 
                    type="submit" 
                    className="bg-red-500 px-5 py-2 border-[1px] border-black rounded-md text-white hover:shadow-lg shadow-red-400 transition-all duration-300"
                    onClick={handleSubmit}
                >
                    Ready for Donate
                </button>
            </form> 
        </div>
    </div>
  )
}

export default Donate