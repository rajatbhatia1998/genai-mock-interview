'use client'

import React,{useState,useEffect} from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Code2, BookOpen, Rocket } from "lucide-react"
import { chatSession } from '@/utils/GeminiAIModal'
import LoaderOverlay from "@/components/ui/loader"
import { useRouter } from "next/navigation"
import { useData } from "@/custom/AppContext"



export default function Technical() {
    const technologyList = [
        {value:"react",lable:"React"},
        {value:"angular",lable:"Angular"},
        {value:"javascript",lable:"Javascript"},
        {value:"python",lable:"Python"},
        {value:"java",lable:"Java"},
        {value:"c++",lable:"C++"},
    ]
  const [technology, setTechnology] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [isLoading,setLoading] = useState("")
  const router = useRouter()
  const { setData } = useData();




  const handleStart = async() => {
    console.log("Starting quiz with:", { technology, difficulty })
    setLoading(true)
    
    let prompt = `give me 5 mcq mix of code & coneceptual on Technology: ${technology} , Difficulty : ${difficulty} . Give response in array in this format '[{question,options,correctIndex,questionType,explainationOfAnswer}]' answer index and field MCQ type that can be code or concept`
    let result = await chatSession.sendMessage(prompt)
    
    let jsonResp = (result.response.text()).replace('```json','').replace('```','')
   
    
    
    setLoading(false)
    try{
        const temp = jsonResp.substring(1,jsonResp.length-3)
        setData(JSON.parse(temp))
    }catch(err){
        const temp = jsonResp.substring(1,jsonResp.length-1)
        setData(JSON.parse(temp))
    }
    
    router.push(`/dashboard/technical/mcq`);
    
  }

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4">

        {isLoading && <LoaderOverlay/>}
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 bg-secondary p-8 text-black">
            <h1 className="text-4xl font-bold mb-4">MCQ Quiz</h1>
            <p className="text-xl mb-6">Test your knowledge in various technologies and difficulty levels.</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <Code2 className="mr-2" />
                <span>Multiple technologies</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="mr-2" />
                <span>Various difficulty levels</span>
              </div>
              <div className="flex items-center">
                <Rocket className="mr-2" />
                <span>Improve your skills</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Quiz Setup</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="technology" className="text-lg">Select Technology</Label>
                <Select onValueChange={setTechnology} value={technology}>
                  <SelectTrigger id="technology">
                    <SelectValue placeholder="Choose a technology" />
                  </SelectTrigger>
                  <SelectContent>
                    {technologyList.map((tech)=>{
                        return  <SelectItem value={tech.value}>{tech.lable}</SelectItem>
                    })}
                   
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-lg">Select Difficulty</Label>
                <Select onValueChange={setDifficulty} value={difficulty}>
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Choose difficulty level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full text-lg py-6"
                onClick={handleStart}
                disabled={!technology || !difficulty}
              >
                Start Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}