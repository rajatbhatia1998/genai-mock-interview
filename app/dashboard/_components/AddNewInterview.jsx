'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import LoaderOverlay from "@/components/ui/loader.jsx"
import { chatSession } from '@/utils/GeminiAIModal'


import { LoaderCircle ,Loader} from 'lucide-react'
import {v4 as uuidv4} from 'uuid'  
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import {collection,addDoc} from '@firebase/firestore'
import db from '../../../firebase/firestore.js'
import { useRouter } from 'next/navigation'



function AddNewInterview() {


  const [openDialog,setOpenDialog] = useState(false)
  const [jobPosition,setJobPosition] = useState("")
  const [techStack,setTechStack] = useState("")
  const [jobExperience,setJobExperience] = useState("")
  const [isLoading,setLoading]  = useState(false)
  const user = useUser().user

  const router = useRouter()
  const submitHandler = async()=>{
    setLoading(true)
    console.log(jobPosition,techStack,jobExperience)
    let prompt = `Job Position : ${jobPosition} , Tech Stack ${techStack} and Job experience : ${jobExperience} years . Based on this data provide 5 questions with answers in JSON format. Give question and answer key in json.`
    let result = await chatSession.sendMessage(prompt)
    let mockJsonResp = (result.response.text()).replace('```json','').replace('```','')
    console.log(mockJsonResp);
    
   let questionsArray = []
   
   let temp = JSON.parse(mockJsonResp)
   console.log("temp",temp)
   if(temp && temp.questions && temp.question.length>0){
      questionsArray = temp.questions
   }else{
    questionsArray = temp
   }
    const data = {
      mockId:uuidv4(),
      jobPosition:jobPosition,
      jobDesc:techStack,
      jobExperience:jobExperience,
      jsonMockResponse:questionsArray,
      createdAt:moment().format('DD-MM-yyyy'),
      createdBy:user.primaryEmailAddress.emailAddress
    }
    console.log("user data",user,data)
    try {
      
      const docRef = await addDoc(collection(db,"mockInterview"),data)
      console.log("Doc added",docRef.id)
      if(docRef.id){
     
        setLoading(false)
        setOpenDialog(false)
        router.push(`/dashboard/Interview/${data.mockId}`)
       
       
      }
    }
    catch(err){
      console.error("Error fireabse adding intrview",err)
    }
   
   
  }
  return (
    <div>
      {/* <LoaderOverlay/> */}
        <div onClick={()=>{setOpenDialog(true)}} className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer'>
            <h2 className='font-bold text-lg text-center'>+ Add New</h2>
            
        </div>
        <Dialog open={openDialog}>
        
                    <DialogContent className={'max-w-2xl'}>
                        <DialogHeader>
                        <DialogTitle className='font-bold '>Tell us more about Interview</DialogTitle>
                        <DialogDescription>
                          
                            <div>
                              
                              <p>Add details about Job postion, Your skills and Year of experience</p>
                              <div className='mt-7 my-3'>
                                <label>Job Role/Position</label>
                                <Input placeholder="Example: Frontend Engineer" required
                                onChange={(event)=>setJobPosition(event.target.value)}
                                />

                              </div>
                              <div className='mt-1 my-3'>
                                <label>Job Description/Tech Stack (In Short)</label>
                                <Textarea
                                onChange={(event)=>setTechStack(event.target.value)}
                                placeholder="Example: React, Angular, Node, Next, Mongo" required/>

                              </div>
                              <div className='mt-1 my-3'>
                                <label>Years of experience</label>
                                <Input 
                                onChange={(event)=>setJobExperience(event.target.value)}
                                placeholder="0" type="number" required minimum="1" maximum="50"/ >

                              </div>
                            </div>
                           
                        </DialogDescription>
                        </DialogHeader>
                        <div className='flex justify-end gap-3'>
                        <Button type="button"  variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
                        <Button type="button" onClick={()=>submitHandler()} variant="default"
                        disabled={isLoading} 
                        >
                          {isLoading ?                         
                            <> <Loader className='animate-spin'/> Generating from AI</> 
                        :
                        <>Start Interview</>
                        }
                          
                        
                        

                        
                        </Button>
    
                        </div>
                    </DialogContent>
                   
                    </Dialog>
    </div>
  )
}

export default AddNewInterview