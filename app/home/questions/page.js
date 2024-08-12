"use client"
import React, { useEffect, useState } from 'react'

import { useForm } from "react-hook-form"

/* Imports For ShadCN  UI */
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import toast, { LoaderIcon, Toaster } from 'react-hot-toast';

import { CheckIcon, FilePlusIcon, PlusCircledIcon } from "@radix-ui/react-icons"


import Dropdown from '../../_components/Dropdown'
import globalApi from '@/app/_services/globalApi'
import InputNumber from '../../_components/InputNumber'
import LoadingOverlay from '../../_components/LoadingOverlay'
import { checkAuth } from '@/hooks/checkAuth'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import axios from 'axios'
import { Trash2 } from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx'

const { htmlToText } = require('html-to-text');


function Page() {


    const [challenges, setChallenges] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [taskType, setTaskType] = useState('')

    const [pageLoading, setPageLoading] = useState(true);
    const [editorData, setEditorData] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [questionError, setQuestionError] = useState(false);
    const [answerError, setAnswerError] = useState({});
    const [currentQuestionId, setCurrentQuestionId] = useState(null);
    const [isDropdownLoading, setIsDropdownLoading] = useState(true)



    checkAuth(setPageLoading); /* Checking is the page authenticated  */
    
    
    const handleAddQuestion = (editorData, questionId = null) => {

      // const strippedData = stripHtmlTags(editorData).trim();
      const strippedData = htmlToText(editorData).trim();
      if (!strippedData) {
        setQuestionError(true);
        toast.error('Please enter a question.');
        return;
      }
    
      if (questionId) {
        setQuestions(questions.map(question => {
          if (question.id === questionId) {
            return { ...question, question: editorData };
          }
          return question;
        }));
      } else {
        setQuestions([...questions, { id: uuidv4(), question: editorData, answers: [], isValid: false }]);
      }
    
      setQuestionError(false);
      setEditorData('');
    };

    const handleAddAnswer = (questionId) => {
      const question = questions.find(question => question.id === questionId);
      if (question.answers.some(answer => answer.text.trim() === '')) {
        setAnswerError(prev => ({ ...prev, [questionId]: true }));
        return;
      }
      setQuestions(questions.map(question => {
        if (question.id === questionId) {
          return {
            ...question,
            answers: [...question.answers, { id: uuidv4(), text: '', marks: '', isCorrect: false }]
          };
        }
        return question;
      }));
      setAnswerError(prev => ({ ...prev, [questionId]: false }));
    };
    
  
    const handleAnswerChange = (questionId, answerId, field, value) => {
      setQuestions(questions.map(question => {
        if (question.id === questionId) {
          return {
            ...question,
            answers: question.answers.map(answer => {
              if (answer.id === answerId) {
                return { ...answer, [field]: value };
              }
              return answer;
            })
          };
        }
        return question;
      }));
    };
  
    const handleDeleteQuestion = (id) => {
      setQuestions(questions.filter(question => question.id !== id));
    };

    const handleDeleteAnswer = (questionId, answerId) => {
      setQuestions(questions.map(question => {
        if (question.id === questionId) {
          return {
            ...question,
            answers: question.answers.filter(answer => answer.id !== answerId)
          };
        }
        return question;
      }));
    };
  
    const validateQuestion = (question) => {
      return question.question && question.answers.length >= 2 && question.answers.every(answer => answer.text && answer.marks);
    };
  


    const getChallenges = async () => {
      setIsDropdownLoading(true)
      try {
        const token = localStorage.getItem('token');
        const resp = await globalApi.GetChallenge(token);
        console.log('Response: of reqqq',resp.data);
        setChallenges(resp.data); 
      } catch (error) {
        console.error('Error Fetching Challenges data:', error);
        toast.error('Error: Failed to Fetch data.');
      }finally {
        setIsDropdownLoading(false);
      }
      
    }

    const getTasks = async (challengeID) => {
      setIsDropdownLoading(true)
      try {
        // const resp = await globalApi.GetAllTasks(challengeID);
        const token = localStorage.getItem('token');
        const resp = await globalApi.GetTask(challengeID, token)
        console.log('Response: of reqqq',resp.data);
        setTasks(resp.data); 
      } catch (error) {
        if (error.response && error.response.data.error) {
          // Use the error message from the backend
          toast.error(error.response.data.error);
          console.error('Error Fetching Task data:', error);
        } else {
          // Fallback error message
          toast.error('An unexpected error occurred.');
        }
      }finally {
        setIsDropdownLoading(false);
      }
      
    }

    // Transforming challenges data to match the dropdownFields format
    const challengeList = challenges.map(challenge => ({
      label: challenge.title, 
      value: challenge.challenge_id,  
    }));

    // Transforming task data to match the dropdownFields format
    const taskList = tasks.map(task => ({
      label: task.task_name, 
      value: task.task_id,
    }));


    console.log("log of question set", questions);

    const form = useForm({
        // resolver: zodResolver(formSchema),
        defaultValues :{
            type: 'text',
            timer: '',
            challengeID: '',
            taskID: '',
            video: 'sample_video.mp4',
            audio: 'sample_audio.mp3',
            image: 'sample_image.png',
            question: '',
            option: 'normal',
            quiz_type: 'least'
          },
      });

      // Watch the value of challengeID
      const challengeID = form.watch('challengeID');
      const taskID = form.watch('taskID');

      useEffect(()=>{
        getChallenges() /* Calling when page loads */
        // getTasks() /* Calling when page loads */
      }, [])

      useEffect(()=>{
        console.log("Trying on page load", challengeID);
        if(challengeID){
          console.log("Trying on inside if");
          getTasks(challengeID) /* Calling when page loads */
        }
      }, [challengeID])

      // Reset tasks when challengeID changes
      useEffect(() => {
        if (challengeID) {
          setTasks([]); // Reset tasks
          // Optionally, fetch new tasks based on challengeID here
          // form.reset('taskID')
          form.setValue('taskID', '')
        }
      }, [challengeID]);


      const CreateNewQuiz = (data) => {
        // Check if we are in a browser environment
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        console.log("json fsdfsfse", token);
        return axios.post('/home/api/createQuiz', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      };
      
      
      const onSubmit = async (data) => {

        setIsLoading(true);
  
        // Add the questions and answers to the data object
        const preparedData = {
          ...data,
          questions: questions.map(question => ({
            id: question.id,
            question: question.question,
            answers: question.answers.map(answer => ({
              id: answer.id,
              text: answer.text,
              marks: answer.marks,
              isCorrect: answer.isCorrect
            }))
          }))
        };
        console.log("preparedD atap r eparedD ata",preparedData);

        setIsLoading(true);
        try {
          const resp = await CreateNewQuiz(preparedData);
          console.log('Response:', resp);
    
          if (resp && resp.status === 201) {
            toast.success('Quiz created successfully!'); /* response.data.message */
            // form.reset();
          } else {
            toast.error('Failed to create Quiz.'); /* console.log('Unexpected status:', response.status); */
          }
        } catch (error) {
          let errorMessage = "An unexpected error occurred.";
          if (error.response && error.response.data && error.response.data.message) {
              errorMessage = error.response.data.message;
          }
          console.error('Error creating Quiz:', error);
          toast.error(errorMessage);
        } finally {
          setIsLoading(false);
        }
        
      }


      // const stripHtmlTags = (html) => {
      //   const div = document.createElement('div');
      //   div.innerHTML = html;
      //   return div.textContent || div.innerText || '';
      // };


      if (pageLoading) {
        return <LoadingOverlay loadText={"Loading..."}/>;
      }

      return (
        <div className='w-full px-4'>

          <div className="container mx-auto px-4 bg-slate-100">
                <h1 className='text-3xl mt-3'>Create Quiz</h1>
                <p>Create quiz</p>
          </div>
          <div className="container mx-auto mt-3 mb-5 p-5">
            <Toaster
              position="top-center"
              reverseOrder={false}
              />
              <Form {...form}>
                {isLoading && <LoadingOverlay loadText="Submitting..."/>}
                <form onSubmit={form.handleSubmit(onSubmit)} >

                <div className='grid grid-cols-3 gap-4 my-10'>
                  {/* <!-- Challenge Type --> */}
                  <Dropdown form={form} name={"challengeID"} label={"Challenge Type"} placeholder={"Select Challenge Type"} dropdownFields={challengeList} formClass={"col-span-1"}/>
    
                  {/* <!-- Challenge Type --> */}
                  <Dropdown form={form} name={"taskID"} label={"Task Type"} placeholder={"Select Task Type"} dropdownFields={taskList} formClass={"col-span-1"} isDisabled={!challengeID}/>

                  
                  {/* Timer */}
                  {/* <TimeInput form={form} name={"timer"} label={"Timer"} formClass={"col-span-1"}/> */}

                  <InputNumber form={form} name={"timer"} label={"Timer"} formClass={"col-span-1"}/>
                </div>

                  {
                    !taskID && !challengeID &&
                    <p className='mb-2'> Select a Challenge and Task to add questions </p>
                  }
                      <div className="mb-5">
                          <Dialog>
                            <DialogTrigger asChild>
                                <Button disabled={!taskID || !challengeID || isLoading}  className="col-span-1" variant="default">
                                    <PlusCircledIcon className="mr-2 h-4 w-4" /> Add a New Question
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[90vw] max-w-[800px] h-[90vh] max-h-[600px] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Enter the question</DialogTitle>
                              <DialogDescription>
                                Make changes to your profile here. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <CKEditor
                              editor={ClassicEditor}
                              data={editorData}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                setEditorData(data);
                              }}
                            />
                            {questionError && <p className="text-red-500">Please enter a question.</p>}
                            <DialogFooter>
                              <div className='space-x-4 '>
                                <DialogClose asChild>
                                  <Button variant="outline"> Close </Button>
                                </DialogClose>
    
                                <Button onClick={() => handleAddQuestion(editorData)}>
                                  Done
                                </Button>
                              </div>
                              
                            </DialogFooter>
                          </DialogContent>
    
                          </Dialog>
                      </div>
                      {questions.length === 0 && <p>No questions available.</p>}
    
                      {questions.map((question, index) => (
                      <div key={question.id} className="border p-4 mb-4 rounded-lg shadow-md">
                        <span className="mr-2 font-bold">Question {index + 1}:</span>
                        <div className="items-center mb-2 grid grid-cols-10 gap-2">
                          {/* <Input className="col-span-5" placeholder="Enter a Question" value={stripHtmlTags(question.question)}/> */}
                          {/* <span>{question.question}</span> */}
                          <Dialog >
                            <DialogTrigger asChild>
                              <Input
                                className="col-span-5"
                                placeholder="Enter a Question"
                                // value={stripHtmlTags(question.question)}
                                value={htmlToText(question.question)}
                                onClick={() => {
                                  setEditorData(question.question);
                                  // Logic to open the dialog
                                }}
                              />
                            </DialogTrigger>
                            <DialogContent className="w-[90vw] max-w-[800px] max-h-[600px] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit the question</DialogTitle>
                              <DialogDescription>
                                Make changes to your question here. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <CKEditor
                              editor={ClassicEditor}
                              data={editorData}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                setEditorData(data);
                              }}
                            />
                            {questionError && <p className="text-red-500">Please enter a question.</p>}
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button onClick={() => {
                                  handleAddQuestion(editorData, question.id); // Update this logic to handle editing
                                  setEditorData('');
                                }}>
                                  Done
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
    
                          </Dialog>
    
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="bg-gray-200 col-span-3"
                                onClick={() => {
                                  setEditorData(question.question);
                                  setCurrentQuestionId(question.id);
                                }}
                              >
                                <FilePlusIcon className="mr-2 h-4 w-4" /> Add/Edit Answers
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[900px] max-h-[750px] overflow-hidden flex flex-col">
                              <DialogHeader>
                                <DialogTitle>Add/Edit answers</DialogTitle>
                                <DialogDescription>
                                  Add or edit answers for your question. Click save when you're done.
                                </DialogDescription>
                              </DialogHeader>
    
                              <div className='mt-10'>
                                <Button onClick={() => handleAddAnswer(currentQuestionId)} className="col-span-3 mb-4" variant="default">
                                  <PlusCircledIcon className="mr-2 h-4 w-4" /> Add
                                </Button>
                              </div>
    
                              <div className='overflow-y-auto h-[600px] min-h-[400px] flex-1 overflow-y-auto'>
                                {questions.find(q => q.id === currentQuestionId)?.answers.map((answer, answerIndex) => (
                                  <>
                                    <span className="mr-2 font-bold">Choice {answerIndex + 1}</span>
                                    <div key={answer.id} className="mb-2 grid grid-cols-10 gap-1 items-center">
                                      <div className="col-span-8">
                                        <CKEditor
                                          editor={ClassicEditor}
                                          data={answer.text}
                                          onChange={(event, editor) => {
                                            const data = editor.getData();
                                            handleAnswerChange(currentQuestionId, answer.id, 'text', data)
                                          }}
                                        />
                                      </div>
        
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button onClick={() => handleDeleteAnswer(currentQuestionId, answer.id)} className="ml-auto text-red-500">
                                              <Trash2 className="h-6 w-6 col-span-2" />
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Delete Answer</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
        
                                      <input
                                        type="number"
                                        min={0}
                                        placeholder="Marks"
                                        value={answer.marks}
                                        onChange={(e) => handleAnswerChange(currentQuestionId, answer.id, 'marks', e.target.value)}
                                        className="border p-2 rounded-md mr-2 col-span-2"
                                      />
        
                                      <FormField
                                        control={form.control}
                                        name="isCorrect"
                                        render={({ field }) => (
                                          <FormItem className="col-span-3">
                                            <Select
                                              onValueChange={() => 
                                                handleAnswerChange(currentQuestionId, answer.id, 'isCorrect', !answer.isCorrect)}
                                                defaultValue={field.value}>
                                              <FormControl>
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Correct Answer?" />
                                                </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                <SelectItem value="yes">Yes</SelectItem>
                                                <SelectItem value="no">No</SelectItem>
                                              </SelectContent>
                                            </Select>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  </>
                                ))}
                              </div>
                              {/* {answerError && <p className="text-red-500">Please add a choice.</p>} */}
                              <DialogFooter className="mt-auto">
                                <DialogClose asChild>
                                  <Button>
                                    Done
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
    
    
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button onClick={() => handleDeleteQuestion(question.id)} className="ml-auto text-red-500">
                                  <Trash2 className="h-6 w-6" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Question</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className={clsx("rounded-full p-2 w-8 h-8 flex items-center justify-center", {
                                  "bg-green-500": validateQuestion(question),
                                  "bg-gray-200": !validateQuestion(question)
                                })}>
                                  <CheckIcon className="h-4 w-4 text-white" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{validateQuestion(question) ? "Complete" : "Incomplete"}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
    
                        <div className="space-y-4">
                        {question.answers.map((answer, answerIndex) => (
                          <div key={answer.id} className="p-4 border rounded-lg shadow-sm bg-white flex items-start space-x-4">
                            <div className="flex-shrink-0 text-center font-bold text-lg text-gray-800">
                              Choice {answerIndex + 1}
                            </div>
                            <div className="flex-1 space-y-2">
                              <p className="text-gray-700 text-sm">{answer.text}</p>
                              <div className="flex justify-between text-sm text-gray-600 mt-5 font-medium">
                                <p>Marks: {answer.marks}</p>
                                <p>Correct Answer: {answer.isCorrect ? 'Yes' : 'No'}</p>
                              </div>
                            </div>
                            <div className="flex-shrink-0 ml-4">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => handleDeleteAnswer(currentQuestionId, answer.id)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete Answer</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        ))}
                      </div>
    
                        {question.answers.length < 2 && (
                          <p className="text-red-500">Please provide at least 2 choices.</p>
                        )}
                      </div>
                      ))}
    
                      <Button type="submit" disabled={!taskID || !challengeID || loading}  className="mt-5">
                        {loading ? (
                          <>
                            <LoaderIcon className="mr-2 inline-block animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit"
                        )}
                      </Button>


                </form>
                
              </Form>
    
          </div>
       
        </div>
      )

}

export default Page
