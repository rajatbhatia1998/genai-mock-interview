import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb, Volume2 } from 'lucide-react'





function Question({mockQuestions,activeIndex}) {
    console.log(mockQuestions)

    const textToSpeech=(question)=>{
        if('speechSynthesis' in window){   
            const speech = new SpeechSynthesisUtterance(question) 
            window.speechSynthesis.speak(speech)
        }else{
            alert("Speech not availble")
        }
    }

  return mockQuestions && (
    <div className='flex-1 p-5 rounded-lg border '>
        <div className='flex flex-1 flex-row items-center text-nowrap flex-wrap justify-around'>
        {mockQuestions.map((question,index)=>{
            return <h2 className={`my-1 cursor-pointer px-2 py-1 bg-secondary rounded-full text-xs md:text-sm text-center
             ${activeIndex===index && 'bg-black text-white'}`}>
                  Question #{index+1}</h2>
        })}
        </div>
       



        <h2 className='my-5 text-lg'>{mockQuestions[activeIndex]?.question}</h2>
        <Volume2  className='cursor-pointer' onClick={()=>textToSpeech(mockQuestions[activeIndex]?.question)}/>
        <div className='border rounded-sm mt-20'>
                        <Alert className='bg-blue-100 border rounded-sm'>
                            <Lightbulb className="h-4 w-4 mr-10 text-blue-600" />
                            <AlertTitle className="text-sm text-blue-700">NOTE</AlertTitle>
                            <AlertDescription>
                                <p className='text-xs text-blue-700'>
                               Click on Record Answer when you want to answer the question.At the end of interview we will give you the feedback along with correct answer for each of question and your answer to compare it.
                               </p>
                            </AlertDescription>
                        </Alert>
                    </div>
    </div>
  )
}

export default Question