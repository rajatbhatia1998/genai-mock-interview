
import { DataProvider } from '@/custom/AppContext';
import Header from './_components/Header'
import { Toaster } from "@/components/ui/sonner"
export const metadata = {
    title: "PrepAI Dashboard",
    description: "Dashboard",
  };



export default function DashboardLayout({children}){
     return (
      <DataProvider>
        <div>
            <Header/>
           
            <div className='mx-5 md:mx-20 lg:mx-36'>
            <Toaster />
            {children}
            </div>
       
        
        </div>
        </DataProvider>
     )
}