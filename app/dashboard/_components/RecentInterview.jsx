'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"

import db from '../../../firebase/firestore.js'
import { collection, query, getDocs, where } from '@firebase/firestore'
import { useUser } from '@clerk/nextjs'
import JobCardSkeleton from './SkeletonCard.jsx'
import Link from 'next/link.js'

function RecentInterview() {

    const [isLoading, setLoading] = useState(false)
    const [recentInterviewList, setInterviewList] = useState([])
    const user = useUser().user


    useEffect(() => {
        console.log(user)
        if(user && user.primaryEmailAddress.emailAddress){
            getRecentInterviews(user.primaryEmailAddress.emailAddress)
        }
        
    }, [user])
    const getRecentInterviews = async (email) => {
        setLoading(true)
        try {
            const q = query(collection(db, "mockInterview"), where("createdBy", "==", email))
            const querySnapshot = await getDocs(q)

            let tempList = []
            querySnapshot.forEach(doc => {
                tempList.push(doc.data())
                //  console.log("snapshot",doc.id,doc.data())

            })
            console.log(tempList)
            setInterviewList(tempList)
            setLoading(false)
        } catch (err) {
            setLoading(false)
            console.log(err)
        }

    }

    if (isLoading) {
        return <JobCardSkeleton />
    }
    return (
        <div className='flex flex-row flex-wrap w-screen'>

            {recentInterviewList && recentInterviewList.length>0 && recentInterviewList.map((interview)=>{
                return  <Card className="mt-5 mr-5 m w-[350px]">
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold">{interview.jobPosition}</h2>
                            <p className="text-sm text-muted-foreground">Experience : {interview.jobExperience}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-sm">Job Description</h3>
                            <p className="text-sm text-muted-foreground">
                                {interview.jobDesc}
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link href={`/dashboard/Interview/${interview.mockId}/feedback`}>
                    <Button variant="outline">Feedback</Button>
                    </Link>
                    <Link href={`/dashboard/Interview/${interview.mockId}/start`}>
                    <Button>Start</Button></Link>
                </CardFooter>
            </Card>
            })}

            {recentInterviewList.length === 0 && isLoading===false 
            
            &&
            <h2 className='font-semibold text-2xl mt-10 ml-[20%]'>You have not taken any mock interview yet !</h2>
            }
           
        </div>
    )
}

export default RecentInterview