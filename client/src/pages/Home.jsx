import { useAuthStore } from "../store/useAuthStore.jsx"
import { Link } from "react-router"
import homepage from './../assets/Landing page.jpg'
import homepageImg from './../assets/Home.jpg' 
import Navbar from "../components/Navbar.jsx"

const Home = () => {

    const {authUser} = useAuthStore()


    return (
        <div className="h-dvh w-dvw">
            {
                authUser ? (
                    <div className="relative">
                        <img className="absolute -z-10 sm:right-20 sm:top-36 cover center w-[30vw] right-0 top-[24vh]" src={homepageImg} alt="blood donation picture" />
                    </div>
                ) : (
                    <div className="relative">
                        <img className="absolute -z-10 sm:right-20 sm:top-36 cover center max-sm:w-[70vw] right-0 top-[34vh]" src={homepage} alt="blood donation picture" />
                    </div>
                )
            }
            { authUser && <Navbar/>}
            <div className="flex justify-between items-center px-5 pt-5 sm:pl-10 pl-5">
                { !authUser ? (<div className="sm:text-[1.2rem]">
                <Link to='/'>
                    <div className="sm:text-[1.2rem] cursor-pointer">
                        <h1> <strong>GCES <span className={authUser ? "text-red-500":"text-blue-400"}>BLOOD LINE</span></strong></h1>
                    </div>
                </Link>
                </div>):(
                    <div className="sm:text-[1.2rem] cursor-pointer">

                    </div>
                )}
                <div className="p-2 sm:p-3"> 
                {
                    !authUser && (
                        <div className="flex gap-3 sm:gap-8">
                            <button className="text-nowrap border-[1px] border-violet-800 rounded-md px-2 py-1 sm:px-6 sm:py-3  text-violet-900 transition-all duration-300 hover:scale-105"> 
                                <Link to='/login'>Sign in</Link>
                            </button>
                            <button className="text-nowrap border-[1px] border-violet-800 rounded-md px-2 py-1 sm:px-5 sm:py-3 bg-violet-900 text-white transition-all duration-300 hover:scale-105"> 
                                <Link to='/signup'>Sign up</Link>
                            </button> 
                        </div>
                    )
                }
                {
                    authUser && (
                        <div className="relative w-full h-full"> 
                            <div className=" w-full absolute flex flex-col top-[5vh] right-[95vw] gap-10">
                                <div className="w-[50vw] flex flex-col gap-5">
                                    <h1 className="text-[2.2rem] text-red-500"><strong>A Small Drop Can Make a Big Difference! 🌍</strong></h1>
                                    <p className="w-[35vw] text-[1.3rem]">
                                    Donating blood saves lives. Every donation can help up to three people in need. Join the cause and make a difference today.
                                    </p>
                                </div>
                                <div className="flex gap-5">
                                    <Link to='/donate'>
                                        <button className="text-nowrap hover:scale-105 cursor-pointer rounded-md transition-all duration-200 text-red-500 border-[1px] border-red-500 px-4 py-2" > 
                                            Donate Now
                                        </button>
                                    </Link>
                                    <Link to='/request'>
                                        <button className="text-nowrap hover:scale-105 cursor-pointer transition-all duration-200 bg-red-500 rounded-md text-white px-4 py-2" > 
                                            Request Blood
                                        </button>  
                                    </Link>
                                </div> 
                            </div>
                        </div>
                    )
                }
                </div> 
            </div>
            <div className="flex flex-col justify-center mt-24">
                {
                    !authUser && (
                        <div className="flex flex-col justify-evenly items-start gap-5 pl-5 sm:pl-10">
                            <h1 className="text-[1.5rem] sm:text-[2rem] w-[60vw] sm:w-[40vw] leading-8 sm:leading-12"><strong>Be the Reason for Someone&rsquo;s Second Chance at Life</strong></h1>
                            <p className="w-[40vw] sm:text-[1.2rem]">Our non-profit platform connects blood donors with those in need, making life-saving donations easier and faster for everyone 🚑❤️</p>
                            <div className="flex gap-5">
                                <button className="text-nowrap border-[1px] border-violet-800 rounded-md px-3 py-1.5 sm:px-5 sm:py-3 bg-violet-900 text-white transition-all duration-300 hover:scale-105"> 
                                        <Link to='/login'>Get Started</Link>
                                </button> 
                                <button className="text-nowrap border-[1px] border-violet-800 rounded-md px-3 py-1.5 sm:px-6 sm:py-3  text-violet-900 transition-all duration-300 hover:scale-105"> 
                                    <Link to='/learnmore'>Learn More</Link>
                                </button>
                                
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Home