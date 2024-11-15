"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { chatSession } from "@/utils/GeminiAIModal"
import LoaderOverlay from "@/components/ui/loader"
import { useRouter } from "next/navigation"

const topics = [
  { id: "arrays", label: "Arrays" },
  { id: "strings", label: "Strings" },
  { id: "graphs", label: "Graphs" },
  { id: "dynamic-programming", label: "Dynamic Programming" },
  { id: "trees", label: "Trees" },
  { id: "sorting", label: "Sorting" },
]

export default function ProblemGeneratorForm() {
  const [difficulty, setDifficulty] = useState("")
  const [topic, setTopic] = useState("")
  const [error, setError] = useState("")
  const [isLoading,setLoading] = useState("")
  const router = useRouter()

  const handleGenerateProblem = () => {
    if (!topic) {
      setError("Please select a topic")
      return
    }
    if (!difficulty) {
      setError("Please select a difficulty level")
      return
    }
    setError("")
    // Here you would typically call an API or function to generate a problem
    
    // generateProblem(topic,difficulty)
    router.push(`/dashboard/playground/${difficulty}/${topic}`);

  }

 

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-1">


{isLoading && <LoaderOverlay/>}
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Problem Generator</CardTitle>
        <CardDescription>Select difficulty and topic to generate a coding problem.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select onValueChange={setDifficulty}>
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Select onValueChange={setTopic}>
            <SelectTrigger id="topic">
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent>
              {topics.map((topic) => (
                <SelectItem key={topic.id} value={topic.id}>
                  {topic.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <Button onClick={handleGenerateProblem}>Generate Problem</Button>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </CardFooter>
    </Card>

    </div>
  )
}