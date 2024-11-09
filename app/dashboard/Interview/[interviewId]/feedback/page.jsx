'use client'
'use strict'

import React,{useEffect,useState} from 'react'
import { getDocs, doc, where, collection, query, getDoc } from '@firebase/firestore'
import db from '../../../../../firebase/firestore'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown ,Lightbulb} from "lucide-react"
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from 'next/link'



function Feedback({params}) {

  const currentInterviewId = params.interviewId
  const [feedbackList,setFeedbackList] = useState([])
  const [total,setTotal] = useState(0)
  useEffect(()=>{
    
    getFeedback()
  },[])

  useEffect(()=>{
    //calculating the rating avg
    if(feedbackList.length>0){
      let total = feedbackList.reduce((tot,val)=>{
        return tot+val.rating
      },0)
    
      console.log("AVG",total)
      setTotal(total)
    }
  },[feedbackList])
  const getFeedback = async () => {
    try {
      const q = query(collection(db, "userAnswers"), where("mockIdRef", "==", currentInterviewId))
      const querySnapshot = await getDocs(q)
      
      let tempList = []
      querySnapshot.forEach(doc => {
        tempList.push(doc.data())
      //  console.log("snapshot",doc.id,doc.data())
  
      })
      console.log(tempList)
      setFeedbackList(tempList)
    } catch (err) {
      console.log(err)
    }
  
  }
 
  return (
    <div className='p-10'>

      <h2 className='text-3xl font-bold text-green-500'>Congrations</h2>
      <h2 className='text-2xl font-bold'>Here is your interview feedback</h2>
      <h2 className='font-bold text-blue-600 mt-5'>Your overall rating : {total}/{25}</h2>
      <h2 className='text-sm'>Find below interview question with correct answer , Your answer and feedback for improvement</h2>
      <div className='mt-10'>

        {feedbackList.map((feedback,index)=>{
          return <Collapsible
         
          className="rounded-md border px-4 py-3 font-mono text-sm mt-2"
        >
          <div className="flex items-center justify-between ">
            <h4 className="text-sm font-semibold">
             {feedback.question}
            </h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
         
          <CollapsibleContent className="mt-2">
                  <Alert className='bg-red-100 border rounded-sm'>
                            <Lightbulb className="h-4 w-4 mr-10 text-red-600" />
                            <AlertTitle className="text-sm text-red-700">Rating {feedback.rating}</AlertTitle>
                            
                        </Alert>
                <Alert className='bg-green-100 border rounded-sm mt-1'>
                            <Lightbulb className="h-4 w-4 mr-10 text-green-600" />
                            <AlertTitle className="text-sm text-green-700">Your Answer</AlertTitle>
                            <AlertDescription>
                                <p className='text-xs text-green-700'>
                                {feedback.userAnswer}
                               </p>
                            </AlertDescription>
                        </Alert>
                        <Alert className='bg-blue-100 border rounded-sm mt-1'>
                            <Lightbulb className="h-4 w-4 mr-10 text-blue-600" />
                            <AlertTitle className="text-sm text-blue-700">Feedback</AlertTitle>
                            <AlertDescription>
                                <p className='text-xs text-blue-700'>
                                {feedback.feedback}
                               </p>
                            </AlertDescription>
                        </Alert>
          </CollapsibleContent>
        </Collapsible>
        })}
      </div>
      <Link className='mt-3' href={'/dashboard'}>
      <Button className='mt-3'>Home</Button>
      </Link>
      
    </div> 
  )
}

export default Feedback