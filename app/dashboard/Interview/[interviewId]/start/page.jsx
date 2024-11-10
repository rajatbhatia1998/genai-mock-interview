'use client'
import { getDocs, doc, where, collection, query, getDoc } from '@firebase/firestore'
import React, { useEffect, useState } from 'react'
import db from '../../../../../firebase/firestore'
import Question from './_component/Question'
import AudioVideo from './_component/AudioVideo'
import { Button } from '@/components/ui/button'
import LoaderOverlay from '@/components/ui/loader'









function Start({ params }) {
  const currentInterviewId = params.interviewId
  const [isLoading,setLoading] = useState(false)
  const [interviewData, setInterviewData] = useState({ docId: null, data: {} })
  const [jsonMockQuestions,setJsonMockQuestion] = useState([])
  const [activeQuestionIndex,setActiveQuestionIndex] = useState(0)




  useEffect(() => {
    getInterviewDetails(currentInterviewId)
  }, [])


  useEffect(() => {
    console.log("interviewData in start ", interviewData)
    if(interviewData.docId){
      try {
        let mockResp = interviewData.data.jsonMockResponse
        console.log(mockResp)
        setJsonMockQuestion(mockResp)
      }catch(err){
        
      }
      
    }
  }, [interviewData])

  const getInterviewDetails = async (id) => {
    setLoading(true)
    try {
      const q = query(collection(db, "mockInterview"), where("mockId", "==", id))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach(doc => {
        if(doc.id){
          setInterviewData({ docId: doc.id, data: doc.data() })
          setLoading(false)
        }
       

      })
    } catch (err) {
      setLoading(false)
      console.log(err)
    }

  }
  const questionHandler = (type)=>{
    console.log('questionHandler',type)
    if(type==="NEXT"){
      setActiveQuestionIndex(activeQuestionIndex+1)
    }else if(type==="PREV"){
      setActiveQuestionIndex(activeQuestionIndex-1)
    }else if(type==="END"){
      
     
    }
  }
  return jsonMockQuestions && (
    <div className='my-10 flex flex-col md:flex-row justify-between '>
       {isLoading && <LoaderOverlay/>}
        <Question mockQuestions={jsonMockQuestions} activeIndex={activeQuestionIndex}/>
        <div>
       
        </div>
        <AudioVideo questionHandler={questionHandler} mockQuestions={jsonMockQuestions} activeIndex={activeQuestionIndex} interviewData={interviewData}/>
        
   
    </div>
  )
}

export default Start