'use client'
import { Button } from '@/components/ui/button'
import { Mic, StopCircle, WebcamIcon } from 'lucide-react'
import Image from 'next/image'
import React,{act, useEffect, useState} from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModal'
import {collection,addDoc} from '@firebase/firestore'
import { useUser } from '@clerk/nextjs'
import db from '../../../../../../firebase/firestore.js'
import Link from 'next/link.js'







function AudioVideo({mockQuestions,activeIndex,interviewData,questionHandler}) {
  const user = useUser().user
  const [isCameraStarted, setCameraStarted] = useState(true)
  const [userAnswer,setUserAnswer] = useState('')
  const [isLoading,setLoading] = useState(false)
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });


  useEffect(()=>{
    console.log(results)
     var temp = ''
    results.map(speech=>{
     
      temp = temp + speech?.transcript
     
    })
    console.log(temp)
    setUserAnswer(temp)
    temp = ''
    
  },[results])

  

 useEffect(()=>{
  if(!isRecording && userAnswer.length>10){
    saveToDatabase()
  }

  if((userAnswer.length<10 && userAnswer.length>1) && !isRecording){
    // toast('Error while saving your answer, Please record again')
  }
 },[userAnswer])


 const saveUserAnswer = async()=>{
 
  
  if(isRecording){
   
    stopSpeechToText()
    
   
   
  }else{
    startSpeechToText()
  }
 }

 const saveToDatabase = async()=>{

  console.log(userAnswer)
  setLoading(true)
  const prompt = `Question: ${mockQuestions[activeIndex]?.question}
  , User Answer: ${userAnswer} ,Depends on question and user answer for given inteview question, 
  Please give us rating for User answer and feedback as area of improvement if any .Just 2 to 5 lines to improve.
  Give in JSON format with rating field and feedback field
   `
   const result = await chatSession.sendMessage(prompt)
   let mockJsonResp = (result.response.text()).replace('```json','').replace('```','')
   console.log(mockJsonResp)
   const JsonResponse = JSON.parse(mockJsonResp)

  const data = {
    mockIdRef:interviewData.data.mockId,
    question:mockQuestions[activeIndex].question,
    correctAnswer:mockQuestions[activeIndex].answer,
    userAnswer:userAnswer,
    feedback:JsonResponse.feedback,
    rating:JsonResponse.rating,
    user:user.primaryEmailAddress.emailAddress
    
  }
  console.log('firestore data',data,interviewData)
  try {
    setLoading(false)
    const docRef = await addDoc(collection(db,"userAnswers"),data)
    console.log("Doc added",docRef.id)
    if(docRef.id){
     
      toast('User answer recorded successfully')
      setResults([])
      // router.push(`/dashboard/Interview/${data.mockId}`)
    }
  }
  catch(err){
    setLoading(false)
    toast('Error',err.message)
  }
 }

  return  (
    <div className='flex flex-col justify-end items-end'>
    <div className='ml-10 flex-1 p-5 rounded-lg border flex flex-col justify-around'>

      <div className='flex flex-col justify-center w-96 bg-black items-center rounded-lg'>


        {isCameraStarted ? 
        
        <Webcam
        onUserMedia={() => setCameraStarted(true)}
        onUserMediaError={(err) => {
          console.log(err)
          setCameraStarted(false)
        }}
       mirrored={true}
       style={{
         height:300,
         zIndex:10
       }}
       />
       
       :

       <WebcamIcon style={{ color: 'white' }} width={200} height={200}/>
      }
       

     
      
     
      </div>

      <Button
        onClick={saveUserAnswer}
      className="mt-5" variant="outline">   
        {!isRecording ?
        
        <h2 className={`flex flex-row justify-center items-center`}> 
          
          <Mic style={{width:15,marginTop:2,marginRight:2}}/> Start Recording</h2>
      :
      <h2 className={`text-red-600 flex flex-row justify-center items-center`}> 
          
          <StopCircle style={{width:15,marginTop:2,marginRight:2}}/> Stop Recording</h2>
        }     
        </Button>
        
       
       
    </div>
      <div className='flex mt-2 justify-around'>
          {activeIndex > 0 && <Button   onClick={()=>questionHandler("PREV")}>Previous Question</Button>}
          {activeIndex!==mockQuestions.length-1 && 
          <Button
          className='ml-2'
          onClick={()=>questionHandler("NEXT")}
          >Next Question</Button>}
          {activeIndex===mockQuestions.length-1 && 
          <Link href={`/dashboard/Interview/${interviewData.data.mockId}/feedback`}>
          
          <Button className='ml-2'  onClick={()=>questionHandler("END")}>End Interview</Button>
          </Link>
          }
      </div>

        </div>
  )
}

export default AudioVideo