'use client'

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import MonacoEditor from "@monaco-editor/react";
import { Sun, MoonStar, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { chatSession } from "@/utils/GeminiAIModal";
import LoaderOverlay from "@/components/ui/loader";




const CodingPlatform = ({ params }) => {
    const [code, setCode] = useState("// Write your solution here...");
    const [language, setLanguage] = useState("javascript");
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [problemMarkdown, setProblemMarkdown] = useState("")
    const handleLanguageChange = (e) => setLanguage(e.target.value);
    const [isLoading, setLoading] = useState(false)


    useEffect(() => {
        console.log(params)
        generateProblem(params.topic, params.difficulty)
    }, [])


    const generateProblem = async (top, diff) => {
        console.log("Generating problem with:", { top, diff })
        setLoading(true)

        let prompt = `
    Generate a ${diff} level coding problem related to ${top}. Include:
1. A clear problem statement.
2. Input format.
3. Output format.
4. Constraints (if any).
5. Example input and output.
6. A brief hint for solving the problem.


Provide response in markdown
    `
        let result = await chatSession.sendMessage(prompt)
        console.log(result.response.text())
        //let jsonResp = (result.response.text()).replace('```json','').replace('```','')

        setProblemMarkdown(result.response.text())

        setLoading(false)





    }
    return (
        <div className={`mx-0 mt-2 min-h-screen bg-gray-100 text-black p-5`}>
            {isLoading && <LoaderOverlay />}
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold">Coding Playground</h1>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDarkTheme(!isDarkTheme)}
                    className="w-10 h-10 relative"
                >
                    {isDarkTheme ? <Sun className="h-[1.2rem] w-[1.2rem]" />
                        : <MoonStar className="h-[1.2rem] w-[1.2rem]" />}
                </Button>


            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Problem Statement */}
                <div className="bg-gray-800 text-white p-5 rounded shadow-md overflow-auto max-h-[80vh]">
                    <h2 className="text-xl font-bold mb-3">Problem Statement</h2>
                    <ReactMarkdown
                        className="p-4 bg-gray-700 rounded"
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || "");
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={materialDark}
                                        language={match[1]}
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={`${className} bg-gray-700 p-1 rounded`} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    >
                        {problemMarkdown}
                    </ReactMarkdown>
                </div>

                {/* Code Editor */}
                <div className="flex flex-col space-y-4">
                    {/* Language Selector */}
                    <div className="flex justify-between items-center">
                        <label htmlFor="language" className="font-semibold">Programming Language:</label>

                        <div className="flex flex-row">
                            <Button className='mr-1'><RefreshCcw /> Run</Button>
                            <select
                                id="language"
                                value={language}
                                onChange={handleLanguageChange}
                                className="bg-primary text-white p-2 rounded shadow-md focus:outline-none"
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                            </select>

                        </div>
                    </div>

                    {/* Code Editor */}
                    <div className="flex-grow">
                        <MonacoEditor
                            height="70vh"
                            language={language}
                            theme={isDarkTheme ? "vs-dark" : "light"}
                            value={code}
                            onChange={(value) => setCode(value)}
                            options={{
                                fontSize: 14,
                                automaticLayout: true,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodingPlatform;
