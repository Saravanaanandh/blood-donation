import loadingImg from './../assets/loadingpng.gif'

const Loading = () => {
  return (
    <div className="w-dvw h-dvh flex flex-col gap-10 items-center justify-center">
        <div className='relative flex items-center justify-center'>
            <div className='absolute size-[14vw] rounded-full border-b-[12px] border-b-red-600  border-l-[6px] border-l-red-500  border-t-[0.5px] border-t-red-400 animate-spin'> 
            </div>
            <img className='w-[10vw] ' src={loadingImg} />
        </div>
        <h1 className="text-[3vw] font-serif">Loading...</h1> 
    </div>
  )
}

export default Loading