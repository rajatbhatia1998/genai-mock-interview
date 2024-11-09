'use client'
import { getDocs, doc, where, collection, query, getDoc } from '@firebase/firestore'
import React, { useEffect, useState } from 'react'
import db from '../../../../../firebase/firestore'
import Question from './_component/Question'
import AudioVideo from './_component/AudioVideo'
import { Button } from '@/components/ui/button'









function Start({ params }) {
  const currentInterviewId = params.interviewId
  const [interviewData, setInterviewData] = useState({ docId: null, data: {} })
  const [jsonMockQuestions,setJsonMockQuestion] = useState([])
  const [activeQuestionIndex,setActiveQuestionIndex] = useState(0)




  useEffect(() => {
    getInterviewDetails(currentInterviewId)
  }, [])


  useEffect(() => {
    console.log("interviewData in start ", interviewData)
    if(interviewData.docId){
      let mockResp = JSON.parse(interviewData.data.jsonMockResponse)
      console.log(mockResp)
      setJsonMockQuestion(mockResp)
    }
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
    <div className='my-10 flex flex-row justify-between '>
       
        <Question mockQuestions={jsonMockQuestions} activeIndex={activeQuestionIndex}/>
        <div>
       
        </div>
        <AudioVideo questionHandler={questionHandler} mockQuestions={jsonMockQuestions} activeIndex={activeQuestionIndex} interviewData={interviewData}/>
        
   
    </div>
  )
}

export default Start