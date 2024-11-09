'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'



export default function Home() {
  const user = useUser().user
  const router = useRouter()
  useEffect(()=>{
    if(user?.primaryEmailAddress?.emailAddress){
      router.push('/dashboard')
    }else{
      router.push('/sign-in')
    }
    //comment
    
  },[])
  
  return (
  <div>
          
  </div>
  );
}
