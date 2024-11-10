import { LoaderCircle,LoaderPinwheel } from 'lucide-react'
import React from 'react'

function LoaderOverlay() {
  return (
    <div className="w-full h-full fixed top-0 left-0 bg-white opacity-75 z-50">
  <div className="flex justify-center items-center mt-[50vh]">
  <LoaderPinwheel className='w-14 h-14 animate-spin'/>
  </div>
</div>
  )
}

export default LoaderOverlay