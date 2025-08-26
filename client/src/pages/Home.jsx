import { useAuthStore } from "../store/useAuthStore.jsx"
import { Link } from "react-router"
import homepage from './../assets/Landing page.jpg'
import homepageImg from './../assets/Home.jpg' 
import Navbar from "../components/Navbar.jsx"
import logo from './../assets/logo1.png' 
import styled, { keyframes } from "styled-components"
import { motion } from "framer-motion"
import blood from './../assets/blood.png'
import blood2 from './../assets/blood4.png'
import {DotLottieReact} from '@lottiefiles/dotlottie-react'
import { useRef, useState } from "react"
import { useNavigate } from "react-router" 
import earth from './../assets/heart2.png'
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three"; 
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog" 
function Globe() {
    // Load the Earth texture
    const texture = useLoader(THREE.TextureLoader, earth);
    const ref = useRef() 
    useFrame((state, delta)=>{ 
        ref.current.rotation.x += delta
        ref.current.rotation.y += delta*1.2
    })
    return (
      <mesh ref={ref}>
        <sphereGeometry args={[2, 64, 64]} /> {/* Sphere with more segments for smoothness */}
        <meshStandardMaterial map={texture} />
      </mesh>
    );
  }

const rotate = keyframes`
    from{
        --angle:0deg
    }
    to{
        --angle:360deg
    }
`
const rotateheart = keyframes`
    from{
        transform:rotateY(0deg)
    }
    to{
        transform: rotateY(360deg);
    }
`
const AnimatedHeart = styled(motion.span)`
    perspective: 1000px;
    animation: ${rotateheart} 2.5s infinite linear;
    filter: drop-shadow(1px 1px 3px white);
`
const Button = styled.div`
    
    position: relative; 
    max-width: 300px;
    max-height: 400px;  
    background-color: #ffffff;
    @property --angle{
        syntax: "<angle>";
        initial-value: 0deg;
        inherits: false;
    }
    &::before,
    &::after{
        content: ''; 
        position: absolute;
        inset: -4px;
        border-radius: 7px;
        background: conic-gradient(from var(--angle),red, white 30%,red); 
        z-index: -1;
        animation: ${rotate} 3.5s infinite linear;
    }
    &::before{
        filter: blur(8px);
        animation: ${rotate} 2.5s infinite linear;
    }  
    &:hover{
        font-size: 1.2rem;
        text-shadow: 0 1px 1px black; 
    } 
`
const BloodDriver = styled(motion.div)`  
    overflow-x: hidden;
    position: absolute;
    width: 350px; 
    bottom:0;  
    left: ${props => props.CheckClick ? '85vw':'0'};
    /* ${(props) => (props.CheckClick ? 'left: 100vw;' : 'left: 0;')} */
    object-fit: cover;
    filter: drop-shadow(1px 1px 3px white);
    transition: all 1.8s linear;
`
const Home = () => {
    const [isClick, setIsClick] = useState(false)
    const navigate = useNavigate(); 
    const reqRef = useRef()
    const handleClick = (e,to, delay) => {  
        e.preventDefault()
        setIsClick(true)
        setTimeout(() => {
            navigate(to);
            setIsClick(false)
        }, delay); 
    };
    
    const {authUser} = useAuthStore()
    return ( 
        <div className="h-dvh w-screen overflow-hidden" >
            <div className="max-sm:max-w-[90vw] w-full" >{
                authUser ? (
                    <motion.div 
                        className="relative"
                        initial={{scale:0,opacity:0}}
                        animate={{scale:1,opacity:1}}
                        transition={{type:'tween',duration:1,delay:0.2}}
                    >   
                        {/* <img className="-z-10 absolute top-0 left-0 min-w-dvw h-dvh object-cover object-center" src={homeBgImg} alt="" /> */}
                        <img className="absolute -z-10 sm:right-20 sm:top-36 cover center w-[30vw] max-sm:w-[50vw] right-0 top-[34vh]" src={homepageImg} alt="blood donation picture" />
                    </motion.div>
                ) : (
                    <motion.div 
                        className="relative"
                        initial={{translateX:'200vw',scale:0,opacity:0}}
                        animate={{translateX:0,scale:1,opacity:1}}
                        transition={{type:'tween',duration:1.4,delay:0.6}}
                    >
                        <img className="absolute -z-10 sm:right-20 sm:top-36 cover center max-sm:w-[70vw] right-0 top-[34vh]" src={homepage} alt="blood donation picture" />
                    </motion.div>
                )
            }</div>
            { authUser && <Navbar/>}
            <div className="w-full flex items-center px-5 pt-5 sm:pl-10 pl-5"> 
                <div className="w-full p-2 sm:p-3"> 
                {
                    !authUser && (
                        <motion.div 
                            className="flex justify-between gap-3 sm:gap-8"
                            initial={{translateY: '-100px',opacity:0}}
                            animate={{translateY:0,opacity:1}}
                            transition={{type:'tween',duration:1.2, delay:0.2}}
                        >
                            <Link to='/'>
                                <div className="sm:text-[1.2rem] cursor-pointer">
                                    <h1 className="flex items-center"><img className="mr-3 w-10 inline-block brightness-150" src={logo} alt="" />  <strong>GCES <span className={authUser ? "text-red-500":"text-blue-400"}>BLOOD LINE</span></strong></h1>
                                </div>
                            </Link>
                            <div className="sm:text-[1.2rem] flex gap-5">
                                <Link to='/login' className="inline-block">
                                    <button className="cursor-pointer text-nowrap border-[1px] border-violet-800 rounded-md px-2 py-1 sm:px-6 sm:py-3  text-violet-900 transition-all duration-300 hover:scale-105" > 
                                        log in
                                    </button>  
                                </Link>
                                <Link to='/signup'  className=" inline-block">
                                    <button className="cursor-pointer text-nowrap border-[1px] border-violet-800 rounded-md px-2 py-1 sm:px-5 sm:py-3 bg-violet-900 text-white transition-all duration-300 hover:scale-105" > 
                                        Sign up
                                    </button>  
                                </Link>
                            </div> 
                        </motion.div>
                    )
                }
                {
                    authUser && ( 
                            <div className=" flex flex-col gap-10">
                                <motion.div 
                                    className="w-[50vw] max-sm:mt-10 sm:w-[70vw] flex flex-col gap-5"
                                    initial={{translateX: '-100px',opacity:0}}
                                    animate={{translateX:0,opacity:1}}
                                    transition={{type:'tween',duration:1.6, delay:0.6}}
                                >
                                    <h1 className="text-[1.7rem] sm:text-[2.2rem] text-red-500 "><strong>A Small Drop Can Make a Big Difference! 
                                    <AnimatedHeart 

                                        className="absolute inline-block w-[100px] max-sm:top-[15vh]"
                                        initial={{scale:0,opacity:0}}
                                        animate={{scale:1,opacity:1}}
                                        transition={{type:'tween',duration:1.4, delay:2}}
                                    > 
                                    <img className="w-full max-sm:p-3" src={earth} alt="" /> 
                                    </AnimatedHeart></strong></h1>
                                    <p className="w-[40vw] sm:w-[45vw] text-[1.1rem] sm:text-[1.3rem]">
                                    Donating blood saves lives. Every donation can help up to three people in need. Join the cause and make a difference today.
                                    </p>
                                </motion.div>
                                <motion.div 
                                    className="w-full sm:my-5 flex justify-center gap-8 sm:pr-96 sm:gap-16"
                                    initial={{translateY:'100vh',scale:0,opacity:0}}
                                    animate={{translateY:0,scale:1,opacity:1}}
                                    transition={{type:'tween',duration:2,delay:1.5}}
                                >
                                    <div to='/donate' onClick={(e)=>handleClick(e,"/donate",1500)}>
                                        <Button className="text-nowrap cursor-pointer rounded-md transition-all duration-200 text-red-600  px-2 sm:px-4 py-1 sm:py-2 w-32 h-32 flex flex-col items-center justify-around bg-white"> 
                                            <motion.span animate={{translateY:[0, 10,0]}} transition={{repeat: Infinity, repeatType: "reverse", duration: 1, ease: "easeInOut"}}><img className="size-20 duration-200" src={blood} alt="" /></motion.span>
                                            <span className="font-extrabold">Donate</span>
                                        </Button>
                                    </div>
                                    <div>
                                        <Button onClick={()=>reqRef?.current?.click()} className="text-nowrap bg-white cursor-pointer transition-all duration-200 rounded-md text-red-600 px-2 sm:px-4 py-1 sm:py-2 w-32 h-32 flex flex-col items-center justify-around "> 
                                        <span><img className="size-20 duration-200 object-center object-scale-down" src={blood2} alt="" /></span>  
                                        <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" ref={reqRef} className="font-extrabold">Request </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>For whom are you going to request?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Note: Please select the correct recipient for the blood request.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel onClick={(e)=>handleClick(e,"/requestme",1500)}className="border-[1px] border-red-500 text-red-500 hover:text-red-500">For Me</AlertDialogCancel>
                                            <AlertDialogAction onClick={(e)=>handleClick(e,"/request",1500)}className="bg-red-500 hover:bg-red-600">Others</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                        </AlertDialog>
                                        </Button>  
                                    </div>
                                </motion.div> 
                                <BloodDriver 
                                    CheckClick={isClick}
                                    initial={`${window.innerWidth}`<600?{translateX:'600px',scale:0.4}:{translateX:'1250px',scale:0.4}}
                                    animate={{translateX:'-100px',scale:1}}
                                    transition={{type:'tween',duration:0.5,delay:2}}
                                >
                                    <DotLottieReact 
                                        className="relative bottom-0"
                                        src="https://lottie.host/644536b1-b213-4ef5-8897-60ba66a505bc/9Ersqo5gFe.lottie"
                                        loop
                                        autoplay
                                    /> 
                                </BloodDriver>
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
                                <Link to='/login'>
                                    <button className="cursor-pointer text-nowrap border-[1px] border-violet-800 rounded-md px-2 py-1 sm:px-6 sm:py-3  text-violet-900 transition-all duration-300 hover:scale-105" > 
                                        Get Started
                                    </button>  
                                </Link>
                                <Link to='/learnmore'>
                                    <button className="cursor-pointer text-nowrap border-[1px] border-violet-800 rounded-md px-2 py-1 sm:px-5 sm:py-3 bg-violet-900 text-white transition-all duration-300 hover:scale-105" > 
                                        Learn More
                                    </button>  
                                </Link> 
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Home
