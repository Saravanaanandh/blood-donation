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
        if(formData.age > 100) return toast.error("Invalid Age")
        if(formData.mobile.toString().length !== 10) return toast.error("Mobile Number Not Valid")
        if(formData.pinCode.toString().length !== 6) return toast.error("Pincode Not Valid")
        if(!formData.email.includes("@gmail.com")) return toast.error("Invalid Email")
        
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
                <h1 className="sm:text-[2rem]"><strong>Blood Donation Consent Form</strong></h1> 
                <p>Your Donation is a Gift of Hop and Healing</p>
            </div>
            <form onSubmit={handleSubmit} className="sm:w-3/5 flex flex-col gap-3  p-5 backdrop:blur-sm border-[1px] border-black rounded-2xl shadow-sm shadow-black">
                <div className="flex flex-col gap-1">
                    <label>Full Name:</label>
                    <input 
                        className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                        type="text" 
                        placeholder="fullname"
                        value={formData.fullname}
                        onChange={(e)=> setFormData({...formData, fullname:e.target.value})}
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label>DOB:</label>
                <input 
                    type="date" 
                    className="border-[1px] border-black rounded-sm outline-none bg-white px-2 py-1" 
                    value={formData.dob || new Date(Date.now()).toISOString().split('T')[0]} 
                    onChange={(e) => setFormData({...formData, dob:e.target.value})} required 
                />
                </div>
                <div className="flex flex-col gap-1">
                    <label>Age:</label>
                <input 
                    type="tel" 
                    className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                    placeholder={`${formData.age ? '': "Enter Age"}`}
                    value={formData.age || ""} 
                    onChange={(e)=> setFormData({...formData, age:parseInt(e.target.value)})}
                    required
                />
                </div>
                <div className="flex flex-col gap-1">
                    <label>Gender:</label>
                <select
                    className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                    onChange={(e)=> setFormData({...formData, gender:e.target.value})}  
                    required
                >
                    <option>select Gender</option>
                    <option value={"MALE"}>Male</option>
                    <option value={"FEMALE"}>Female</option> 
                </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label>Blood Group:</label>
                <select
                    onChange={(e)=> setFormData({...formData, bloodType:e.target.value})} 
                    className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                    required
                >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="A1+">A1+</option>
                    <option value="A1-">A1-</option>
                    <option value="A2+">A2+</option>
                    <option value="A2-">A2-</option>
                    <option value="A1B+">A1B+</option>
                    <option value="A1B-">A1B-</option>
                    <option value="A2B+">A2B+</option>
                    <option value="A2B-">A2B-</option>
                    <option value="Bombay Blood Group">Bombay Blood Group</option>
                    </select> 
                    </div>
                    <div className="flex flex-col gap-1">
                    <label>District:</label>
                    <select
                        onChange={(e)=> setFormData({...formData, district:e.target.value})} 
                        className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                        required
                    >
                        <option value="">Select District</option>
                        <option value="Ariyalur">Ariyalur</option>
                        <option value="Chengalpattu">Chengalpattu</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Coimbatore">Coimbatore</option>
                        <option value="Cuddalore">Cuddalore</option>
                        <option value="Dharmapuri">Dharmapuri</option>
                        <option value="Dindigul">Dindigul</option>
                        <option value="Erode">Erode</option>
                        <option value="Kallakurichi">Kallakurichi</option>
                        <option value="Kanchipuram">Kanchipuram</option>
                        <option value="Kanyakumari">Kanyakumari</option>
                        <option value="Karur">Karur</option>
                        <option value="Krishnagiri">Krishnagiri</option>
                        <option value="Madurai">Madurai</option>
                        <option value="Mayiladuthurai">Mayiladuthurai</option>
                        <option value="Nagapattinam">Nagapattinam</option>
                        <option value="Namakkal">Namakkal</option>
                        <option value="Nilgiris">Nilgiris</option>
                        <option value="Perambalur">Perambalur</option>
                        <option value="Pudukkottai">Pudukkottai</option>
                        <option value="Ramanathapuram">Ramanathapuram</option>
                        <option value="Ranipet">Ranipet</option>
                        <option value="Salem">Salem</option>
                        <option value="Sivaganga">Sivaganga</option>
                        <option value="Tenkasi">Tenkasi</option>
                        <option value="Thanjavur">Thanjavur</option>
                        <option value="Theni">Theni</option>
                        <option value="Thoothukudi">Thoothukudi</option>
                        <option value="Tiruchirappalli">Tiruchirappalli</option>
                        <option value="Tirunelveli">Tirunelveli</option>
                        <option value="Tirupathur">Tirupathur</option>
                        <option value="Tiruppur">Tiruppur</option>
                        <option value="Tiruvallur">Tiruvallur</option>
                        <option value="Tiruvannamalai">Tiruvannamalai</option>
                        <option value="Tiruvarur">Tiruvarur</option>
                        <option value="Vellore">Vellore</option>
                        <option value="Viluppuram">Viluppuram</option>
                        <option value="Virudhunagar">Virudhunagar</option>
                    </select>
                    </div>
                    <div className="flex flex-col gap-1">
                    <label>Village/city:</label>
                <input 
                    type="text" 
                    className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                    placeholder="Enter village"
                    value={formData.villageCity}
                    onChange={(e)=> setFormData({...formData, villageCity:e.target.value})}
                    required
                />
                </div>
                <div className="flex flex-col gap-1">
                    <label>Pincode:</label>
                <input 
                    type="text" 
                    className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                    placeholder={formData.pinCode ? '': "Enter pincode"}
                    value={formData.pinCode || ""} 
                    onChange={(e)=> setFormData({...formData, pinCode:parseInt(e.target.value)})}
                    required
                /> 
                </div>
                <div className="flex flex-col gap-1">
                    <label>Mobile Number:</label>
                <input 
                    type="tel" 
                    className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                    placeholder={formData.mobile ? '': "phone number"}
                    value={formData.mobile || ""} 
                    onChange={(e)=> setFormData({...formData, mobile:parseInt(e.target.value)})}
                    required
                /> 
                </div>
                <div className="flex flex-col gap-1">
                    <label>Email:</label>
                <input 
                    className="border-[1px] border-black rounded-md outline-none bg-white px-3 py-1.5"
                    type="email" 
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e)=> setFormData({...formData, email:e.target.value})}
                    required
                /> 
                </div>
                <div className="flex flex-col gap-1">
                    <label>Last Six Months Activity:</label>
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
                </div>

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