'use client'

import React from 'react'
import { UserButton } from "@clerk/nextjs";
import Image from 'next/image'
import { usePathname } from 'next/navigation';
function Header() {



    const path = usePathname()

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-md'>

        <Image src={'/logo.svg'} width={60} height={60} alt='logo'/>
        <ul className='hidden md:flex gap-6'>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard' && 'text-primary font-bold'}`}>Dashboard</li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard/questions' && 'text-primary font-bold'}`}>Questions</li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard/upgrade' && 'text-primary font-bold'}`}>Upgrade</li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard/how' && 'text-primary font-bold'}`}>How it works ?</li>
        </ul>



<UserButton/>
    </div>
  )
}

export default Header