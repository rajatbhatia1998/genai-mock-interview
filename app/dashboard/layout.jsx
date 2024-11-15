'use client'
import { DataProvider } from '@/custom/AppContext';
import Header from './_components/Header'
import { Toaster } from "@/components/ui/sonner"
// export const metadata = {
//     title: "PrepAI Dashboard",
//     description: "Dashboard",
//   };


 
import { usePathname } from 'next/navigation'
import { useEffect,useState } from 'react';

export default function DashboardLayout({children}){
  const pathname = usePathname()
 // let parentCss = "mx-5 md:mx-20 lg:mx-36"
  let [parentCss,setParentCss] = useState("")
 
  useEffect(()=>{
   
    let arr = pathname.split('/')
    console.log("pathname",pathname,arr)
    if(arr[1] === 'dashboard' && arr[2] === "playground"){
      setParentCss("mx-0")
    }else{
      setParentCss("mx-5 md:mx-20 lg:mx-36")
    }
  },[pathname])

     return (
      <DataProvider>
        <div>
            <Header/>
           
            <div className={parentCss}>
            <Toaster />
            {children}
            </div>
       
        
        </div>
        </DataProvider>
     )
}