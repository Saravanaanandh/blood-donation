import { useState } from "react"
import { Link } from "react-router"
import toast from "react-hot-toast"
import { useAuthStore } from "../store/useAuthStore.jsx"
import signupImg from './../assets/Register.jpg'
const Signup = () => {
    
    const {signup} = useAuthStore()
    const [formData,setFormData] = useState({
        username:"",
        age:"",
        gender:"",
        bloodType:"",
        location:"",
        pinCode: "", 
        mobile: "",
        email:"",
        password:""
    })
    const [isChecked, setIsChecked] = useState(false)

    const handleSubmit = async(e)=>{
        e.preventDefault()

        if(!formData.username || !formData.age || !formData.gender || !formData.bloodType || !formData.location || !formData.pinCode || !formData.mobile || !formData.email || !formData.password) return toast.error("please fill the all required fields!")

        try{
            await signup(formData) 
        }catch(err){
            console.log(err.message)
            toast.error("something went wrong, try again later"+err.message)
        }
        setFormData({
            username:"",
            age:"",
            gender:"",
            bloodType:"",
            location:"",
            pinCode: "", 
            mobile: "",
            email:"",
            password:""
        })
    }

    return (
      <div className="max-w-[100vw] min-h-[100vh] overflow-y-auto bg-no-repeat bg-cover bg-fixed " style={{background:`url(${signupImg})`}}>
          
        <form onSubmit={handleSubmit} className="flex items-center justify-center my-10 max-sm:my-4">
            
            <div className="flex flex-col items-center gap-5 min-h-auto w-[80vw] sm:w-[40vw] bg-amber-50 py-10 rounded-2xl max-sm:py-5">
            <h1 className="sm:text-[2rem]"><strong>Create Account</strong></h1>
            <input 
                className="bg-gray-300 sm:w-[30vw] w-[80%] outline-none border-none p-2 rounded-md"
                type="text" 
                placeholder="Enter fullname"
                value={formData.username}
                onChange={(e)=> setFormData({...formData, username:e.target.value})}
                required
            />
            <input 
                className="bg-gray-300 sm:w-[30vw] w-[80%] outline-none border-none p-2 rounded-md"
                type="tel" 
                placeholder={`${formData.age ? '': "Enter Age"}`}
                value={formData.age || ''}
                onChange={(e)=> setFormData({...formData, age:parseInt(e.target.value)})}
                required
            />
            <select
                onChange={(e)=> setFormData({...formData, bloodType:e.target.value})} 
                className="bg-gray-300 sm:w-[30vw] w-[80%] outline-none border-none p-2 rounded-md"
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
            <select
                className="bg-gray-300 sm:w-[30vw] w-[80%] outline-none border-none p-2 rounded-md"
                onChange={(e)=> setFormData({...formData, gender:e.target.value})}  
                required
            >
                <option>select Gender</option>
                <option value={"MALE"}>Male</option>
                <option value={"FEMALE"}>Female</option> 
            </select>
            <input 
                className="bg-gray-300 sm:w-[30vw] w-[80%] outline-none border-none p-2 rounded-md"
                type="text" 
                placeholder="Enter your current location"
                value={formData.location}
                onChange={(e)=> setFormData({...formData, location:e.target.value})}
                required
            />
            <input 
                className="bg-gray-300 sm:w-[30vw] w-[80%] outline-none border-none p-2 rounded-md"
                type="tel" 
                placeholder={`${formData.pinCode ? '': "Enter pincode"}`}
                value={formData.pinCode || ""}
                onChange={(e)=> setFormData({...formData, pinCode:parseInt(e.target.value)})}
                required
            />
            <input 
                className="bg-gray-300 sm:w-[30vw] w-[80%] outline-none border-none p-2 rounded-md"
                type="tel" 
                placeholder={`${formData.mobile ? '': "Enter Mobile No."}`}
                value={formData.mobile || ""} 
                onChange={(e)=> setFormData({...formData, mobile:parseInt(e.target.value)})}
                required
            />
            <input 
                className="bg-gray-300 sm:w-[30vw] w-[80%] outline-none border-none p-2 rounded-md"
                type="email" 
                placeholder="Enter email"
                value={formData.email}
                onChange={(e)=> setFormData({...formData, email:e.target.value})}
                required
            />
            <input 
                className="bg-gray-300 sm:w-[30vw] w-[80%] outline-none border-none p-2 rounded-md"
                type="text" 
                placeholder="Enter password"
                value={formData.password}
                onChange={(e)=> setFormData({...formData, password:e.target.value})}
                required
            />
            <div>
                <input
                    className="bg-gray-300 mr-2 outline-none border-none p-2 rounded-md"
                    type="checkbox" 
                    checked={isChecked}
                    onChange={()=> setIsChecked(!isChecked)}
                /> 
                <span>I agree with <a href="">Terms & Conditions</a></span>
            </div>
            <div className="sm:w-[30vw] w-[80%] text-center">
                <button className="w-full text-nowrap border-[1px] border-violet-800 rounded-md px-2 py-1 sm:px-5 sm:py-2.5 bg-violet-900 text-white transition-all duration-300 hover:scale-105" type="submit" onClick={handleSubmit} disabled={!isChecked}>
                    Create Account
                </button>
                <div className="mt-2">
                    <p>Already Registered?<Link to='/login'>login</Link>
                    </p>
                </div> 
            </div>
             
            </div>
        </form>
      </div>
    )
  }
  
  export default Signup