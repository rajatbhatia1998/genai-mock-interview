'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'




export default function Home() {
  const { isLoaded, userId, sessionId } = useAuth()
  const router = useRouter()
  useEffect(()=>{
    console.log(isLoaded,userId,sessionId)
    // if(isLoaded && userId){
    //   router.replace('/dashboard')
    // }else{
    //   router.replace('/sign-in')
    // }
    
  },[])

  
  return (
  <div>
          
  </div>
  );
}
