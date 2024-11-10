'use client'

import React,{useEffect,useState} from "react"
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useData } from "@/custom/AppContext"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Link from "next/link"





export default function MCQScreen() {
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [allQuestions,setAllQuestions] = useState([])
  const [currentQuestionIndex,setCurrentQuestionIndex] = useState(0)
  const [currentQuestion,setCurrentQuestion] = useState({question:""})
  const [totalScore,setTotalScore ] = useState(0)
  const [showCelebration,setShowCelebration] = useState(false)
  const router = useRouter()
  const { data } = useData();
  const { width, height } = useWindowSize()

  


  useEffect(() => {
    console.log(data) 
    if(data.length>0){
      setAllQuestions(data)
      setCurrentQuestion(data[0])
    }
  }, [data]);


  const handleSubmit = () => {
    console.log(selectedAnswer,currentQuestion)
    if(selectedAnswer === currentQuestion.correctIndex){
      setTotalScore(totalScore+1)
    }
    if (selectedAnswer !== null) {
      setIsAnswerSubmitted(true)
    }
  }

  const handleNext = () => {
    
    setCurrentQuestion(allQuestions[currentQuestionIndex+1])
    setCurrentQuestionIndex(currentQuestionIndex+1)
    
    setSelectedAnswer(null)
    setIsAnswerSubmitted(false)
  }
  const handleFinish = ()=>{
    setShowCelebration(true)
  }
  return  (
    <div className="min-h-screen flex items-center justify-center p-4">
        <Drawer>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Question ({currentQuestionIndex+1} / {allQuestions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-6">{currentQuestion.question}</p>
          <RadioGroup
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            value={selectedAnswer?.toString()}
            className="space-y-3"
          >
            {currentQuestion &&  currentQuestion.options && currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 border rounded-lg p-4 ${
                  isAnswerSubmitted
                    ? index === currentQuestion.correctIndex
                      ? 'bg-green-100 border-green-500'
                      : selectedAnswer === index
                      ? 'bg-red-100 border-red-500'
                      : ''
                    : ''
                }`}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={isAnswerSubmitted} />
                <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                  {option}
                </Label>
                {isAnswerSubmitted && index === currentQuestion.correctIndex && (
                  <span className="text-green-600">✓</span>
                )}
                {isAnswerSubmitted && selectedAnswer === index && index !== currentQuestion.correctIndex && (
                  <span className="text-red-600">✗</span>
                )}
              </div>
            ))}
          </RadioGroup>
          <div>
            {isAnswerSubmitted && 
            <h2 className="border border-yellow-600 rounded-lg p-5 mt-5 bg-yellow-200 font-semibold text-sm ">
              {currentQuestion.explanationOfAnswer}</h2>
            }
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={()=>handleSubmit()}
            disabled={selectedAnswer === null || isAnswerSubmitted}
          >
            Submit Answer
          </Button>
          {isAnswerSubmitted && currentQuestionIndex!==allQuestions.length-1 && (
           
            <Button onClick={handleNext}>
              Next Question
            </Button>
          )}
          {currentQuestionIndex===allQuestions.length-1 &&
          <DrawerTrigger><Button className='bg-red-500 hover:bg-red-800' onClick={handleFinish}>
          Finish Test
        </Button></DrawerTrigger>
            
          }
        </CardFooter>
      </Card>
    
      
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Finish Test</DrawerTitle>
          <DrawerDescription>Check you final score after assessment</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col">
            <h2 className="flex justify-center items-center font-bold text-3xl">Total Score</h2>
            <h2 className="flex justify-center items-center text-2xl">{totalScore} out of {allQuestions.length}</h2>
        </div>
        <DrawerFooter>
          
          <Button className=''><Link href={'/dashboard'}>Okay </Link></Button>
          
         
          <DrawerClose>
            <Button variant="outline" onClick={()=>{setShowCelebration(false)}}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
    {showCelebration && <Confetti
      width={width}
      height={height}
    />}
    
    </div>
  )
}