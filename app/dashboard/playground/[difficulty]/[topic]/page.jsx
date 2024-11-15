"use client";
import React, { useEffect, useRef, useState } from "react";
import { ModeToggleBtn } from "./_components/mode-toggle-btn";
import SelectLanguages, {
    selectedLanguageOptionProps,
} from "./_components/SelectLanguages";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

import { Loader, Play, TriangleAlert } from "lucide-react";
import { codeSnippets, languageOptions } from "./_utils/utils";
import { compileCode } from "./api"
import toast,{Toaster} from "react-hot-toast";
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown'
import { chatSession } from "@/utils/GeminiAIModal";
import LoaderOverlay from "@/components/ui/loader";
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'
import { useRouter } from "next/navigation";







export default function EditorComponent({ params }) {
    const { theme } = useTheme();
    const { width, height } = useWindowSize()
    const [sourceCode, setSourceCode] = useState(codeSnippets["javascript"]);
    const [languageOption, setLanguageOption] = useState(languageOptions[0]);
    const [loading, setLoading] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [fetchingFromGenAI, setfetchingFromGenAI] = useState(false);
    const [output, setOutput] = useState([]);
    const [err, setErr] = useState(false);
    const [problemMarkdown, setProblemMarkdown] = useState("")
    const router = useRouter()
    const editorRef = useRef(null);
 
    function handleEditorDidMount(editor) {
        editorRef.current = editor;
        editor.focus();
    }
    function handleOnchange(value) {
        if (value) {
            setSourceCode(value);
        }
    }
    useEffect(() => {
        generateProblem(params.topic, params.difficulty)
    }, [params])
    const generateProblem = async (top, diff) => {
        console.log("Generating problem with:", { top, diff })
        setfetchingFromGenAI(true)
        
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
      

        setProblemMarkdown(result.response.text())

        setfetchingFromGenAI(false)
        toast.success('Successfully loaded problem statement!')




    }
    function onSelect(value) {
        setLanguageOption(value);
        setSourceCode(codeSnippets[value.language]);
    }
    const onSubmitHandler = ()=>{
        setShowCelebration(true)
        setTimeout(()=>{
            setShowCelebration(false)
            router.replace('/dashboard')
        },5000)
    }

    async function executeCode() {
        setLoading(true);
        const requestData = {
            language: languageOption.language,
            version: languageOption.version,
            files: [
                {
                    content: sourceCode,
                },
            ],
        };
        try {
            const result = await compileCode(requestData);
            setOutput(result.run.output.split("\n"));
            console.log(result);
            setLoading(false);
            setErr(false);
            toast.success("Compiled Successfully");
        } catch (error) {
            setErr(true);
            setLoading(false);
            toast.error("Failed to compile the Code");
            console.log(error);
        }
    }
    // console.log(languageOption);
    return (
        
        <div className="min-h-screen bg-white shadow-2xl py-6 px-8">
            {showCelebration && <Confetti
      width={width}
      height={height}
    />}
    <Toaster/>
    {fetchingFromGenAI && <LoaderOverlay/>}
            {/* EDITOR HEADER */}
            <div className="flex items-center justify-between pb-3">
                <h2 className="scroll-m-20  text-2xl font-semibold tracking-tight first:mt-0">
                    Coding Playground
                </h2>
                <div className="flex items-center space-x-2 ">
                    {/* <ModeToggleBtn /> */}
                    <div className="w-[230px]">
                        <SelectLanguages
                            onSelect={onSelect}
                            selectedLanguageOption={languageOption}
                        />
                    </div>
                </div>
            </div>
            {/* EDITOR  */}
            <div className="bg-secondary p-3 rounded-2xl">
                <ResizablePanelGroup
                    direction="horizontal"
                    className="w-full rounded-lg border"
                >

                    <ResizablePanel defaultSize={50}
                    className="h-screen overflow-y-auto "
                    >
                        <ReactMarkdown
                            className="p-4 rounded h-screen overflow-y-auto"
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
                                        <code className={`${className} bg-gray-700 p-2 w-auto mt-1 text-white rounded`} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {problemMarkdown}
                        </ReactMarkdown>
                    </ResizablePanel>

                    <ResizablePanel defaultSize={50}>
                        <ResizablePanelGroup
                            direction='vertical'
                            className="w-full rounded-lg border dark:bg-slate-900"
                        >
                            <ResizablePanel defaultSize={75} minSize={35}
                            
                            className="pt-8">
                                <Editor
                                    theme={theme === "dark" ? "vs-dark" : "vs-light"}
                                    height="100vh"
                                    
                                    defaultLanguage={languageOption.language}
                                    defaultValue={sourceCode}
                                    onMount={handleEditorDidMount}
                                    value={sourceCode}
                                    onChange={handleOnchange}
                                    language={languageOption.language}
                                />
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={25} >
                                {/* Header */}
                                <div className="space-y-3 bg-secondary min-h-screen">
                                    <div className="flex items-center justify-between  bg-primary text-white  px-6 py-2">
                                        <h2>Output</h2>
                                        <div>

                                     
                                        {loading ? (
                                            <Button
                                                disabled
                                                size={"sm"}
                                                className="dark:bg-purple-600 dark:hover:bg-purple-700 text-slate-100 bg-slate-800 hover:bg-slate-900"
                                            >
                                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                                <span>Running please wait...</span>
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={executeCode}
                                                size={"sm"}
                                                className="dark:bg-purple-600 dark:hover:bg-purple-700 text-slate-100 bg-slate-800 hover:bg-slate-900"
                                            >
                                                <Play className="w-4 h-4 mr-2 " />
                                                <span>Run</span>
                                            </Button>
                                        )}
                                        <Button 
                                        onClick={()=>{onSubmitHandler()}}
                                        className="bg-green-400 text-white ml-1 hover:text-white ">Submit</Button>
                                        </div>
                                    </div>
                                    <div className=" px-6 space-y-2">
                                        {err ? (
                                            <div className="flex items-center space-x-2 text-red-500 border border-red-600 px-6 py-6">
                                                <TriangleAlert className="w-5 h-5 mr-2 flex-shrink-0" />
                                                <p className="text-xs">
                                                    Failed to Compile the Code , Please try again !
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                {output.map((item) => {
                                                    return (
                                                        <p className="text-sm" key={item}>
                                                            {item}
                                                        </p>
                                                    );
                                                })}
                                            </>
                                        )}
                                    </div>
                                </div>
                                {/* Body */}
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
}