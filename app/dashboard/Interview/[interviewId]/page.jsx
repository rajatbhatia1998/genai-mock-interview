"use client"

import { getDocs, doc, where, collection, query, getDoc } from '@firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Terminal } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import db from '../../../../firebase/firestore'
import Webcam from 'react-webcam'
import { Button } from '@/components/ui/button'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import Link from 'next/link'



function Interview({ params }) {
    const currentInterviewId = params.interviewId
    const [interviewData, setInterviewData] = useState({ id: null, data: {} })
    const [isCameraStarted, setCameraStarted] = useState(false)
    useEffect(() => {
        getInterviewDetails(currentInterviewId)
    }, [])


    useEffect(() => {
        console.log("interviewData", interviewData)
    }, [interviewData])
    const getInterviewDetails = async (id) => {
        try {
            const q = query(collection(db, "mockInterview"), where("mockId", "==", id))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach(doc => {
                setInterviewData({ docId: doc.id, data: doc.data() })

            })
        } catch (err) {
            console.log(err)
        }



    }
    return (
        <div className='my-10 flex flex-col md:flex-col'>


            <h2 className='font-bold text-2xl'>Let's get started</h2>
            <div className='flex flex-col md:flex-row'>

                <div className='px-1 mr-10'>
                    <div className='flex flex-col my-5 border rounded-lg p-5 '>
                        <h2 className='text-lg'><strong>Job Position: </strong>{interviewData.data.jobPosition}</h2>
                        <h2 className='text-lg'><strong>Job Description: </strong>{interviewData.data.jobDesc}</h2>
                        <h2 className='text-lg'><strong>Job Experience: </strong>{interviewData.data.jobExperience}</h2>
                    </div>
                    <div className='border rounded-sm'>
                        <Alert className='bg-yellow-100 border rounded-sm'>
                            <Lightbulb className="h-4 w-4 mr-10  fill-yellow-400" />
                            <AlertTitle>Information</AlertTitle>
                            <AlertDescription>
                                Enable the Web Camera and Microphone to start your AI Generated Mock Interview. It has 5 questions which you can answer. In end of interview you will get report based upon answers given by you .
                                <p><strong>NOTE:</strong> We never record your video , Webcam access you can disable any time if you want</p>
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>



                <div className='flex'>
                    {isCameraStarted ?
                        <div className='flex justify-center flex-col items-center'>
                            <Webcam
                                style={{ width: 750, height: 300 }}
                                onUserMedia={() => setCameraStarted(true)}
                                onUserMediaError={(err) => {
                                    console.log(err)
                                    setCameraStarted(false)
                                }}
                                mirrored={true} />
                                <Link href={`/dashboard/Interview/${currentInterviewId}/start`}>
                                <Button onClick={() => {}}>Start Interview</Button>
                                </Link>
                            
                        </div>
                        : <div className='flex flex-col justify-center items-center'>
                            <WebcamIcon className='my-5 p-20 w-72 h-72 bg-secondary rounded-lg border' />
                            <Button onClick={() => {
                                setCameraStarted(true)
                            }}>Enable Web Camera & Mic. </Button>
                        </div>
                    }


                </div>

            </div>





        </div>
    )
}

export default Interview