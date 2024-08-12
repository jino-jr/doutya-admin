"use client"
import React, { useEffect, useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { Textarea } from "@/components/ui/textarea"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import toast, { LoaderIcon, Toaster } from 'react-hot-toast';
import { cn } from "@/lib/utils"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Calendar } from "@/components/ui/calendar"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"


import Dropdown from '../../_components/Dropdown'
import globalApi from '@/app/_services/globalApi'
import InputNumber from '../../_components/InputNumber'
import InputText from '../../_components/InputText'
import LoadingOverlay from '../../_components/LoadingOverlay'
import TimeInput from '../../_components/TimeInput'
import RadioInput from '../../_components/RadioInput'
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

const baseSchema = {
  taskName: z.string().min(2, { message: "Task Name must be at least 2 characters long." }).max(50, { message: "Title must be at most 50 characters long." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long." }),
  challengeID: z.number().positive({ message: "Please select a valid challenge type." }),
  startDate: z.date({
    required_error: "A start date is required.",
  }),
  endDate: z.date({
    required_error: "An end date is required.",
  }),
  startTime: z.string().min(1, { message: "Start time is required." }),
  endTime: z.string().min(1, { message: "End time is required." }),
  taskType: z.string().min(1, { message: "Task type is required." }), 
  verificationMethod: z.string().default("manual"), 
  playerLevel: z.string().default("1"), 
  createdBy: z.string().default("admin"),
  quizType: z.string().min(1, { message: "Quiz Type is required." }),
  winMark: z.number({
    required_error: "Win Mark is required.",
  }),
  taskPercent: z.number({
    required_error: "Task Percent is required.",
  }),
  taskVariety: z.string().min(1, { message: "Task Variety is required." }),
  live: z.string().min(1, { message: "Live data is required " }),
  rank: z.number({
    required_error: "Rank is required.",
  }),
};

const mapTaskFields = {
  latitude: z.number().optional().refine(value => value !== undefined, {
    message: "Latitude data is required for this task type."
  }),
  longitude: z.number().optional().refine(value => value !== undefined, {
    message: "Longitude data is required for this task type."
  }),
  radius: z.number().optional().refine(value => value !== undefined, {
    message: "Radius data is required for this task type."
  }),
};

const mediaCaptureFields = {
  mediaTitle: z.string().optional().refine(value => value !== "", {
    message: "Media Title is required for this task type."
  }),
  mediaType: z.string().optional().refine(value => value !== "", {
    message: "Media Type is required for this task type."
  }),
  mediaDuration: z.string().optional().refine(value => value !== "", {
    message: "Media Duration is required for this task type."
  }),
};


  const taskTypes = [
    { label: "Map", value: "map" },
    { label: "Media Capture", value: "mediaCapture" },
    { label: "Quiz", value: "quiz" },
  ];

  const verifyMethod = [
    { label: "Manual", value: "manual" },
  ];

  const mediaTypes = [
    { label: "Photo", value: "photo" },
    { label: "Video", value: "video" },
  ];

  const enumType = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  const quizTypes = [
    { label: "Normal", value: "normal" },
    { label: "Psychological", value: "psychological" },
  ];
  
  const taskVarieties = [
    { label: "Technical", value: "technical" },
    { label: "Aptitude", value: "aptitude" },
  ];

  
function pages() {

    const [startDate, setStartDate] = useState(null); 

    const [challenges, setChallenges] = useState([]);

    const [isChallengeLoading, setIsChallengeLoading] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [taskType, setTaskType] = useState('')
    const [mediaType, setMediaType] = useState(undefined)

    const [pageLoading, setPageLoading] = useState(true);
    const [editorData, setEditorData] = useState('');

    checkAuth(setPageLoading); /* Checking is the page authenticated  */

    let formSchema;
    if (taskType === "map") {
      formSchema = z.object({
        ...baseSchema,
        ...mapTaskFields
      });
    } else if (taskType === "mediaCapture") {
      formSchema = z.object({
        ...baseSchema,
        ...mediaCaptureFields
      });
    } else {
      formSchema = z.object(baseSchema);
    }

    // if(mediaType !== undefined){
    //   if (mediaType === "video") {
    //     formSchema = z.object({
    //       ...baseSchema,
    //       ...mediaCaptureVideoFields
    //     });
    //   } else if (mediaType === "photo") {
    //     formSchema = z.object({
    //       ...baseSchema,
    //       ...mediaCapturePhotoFields
    //     });
    //   }
    // }

    const  form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues :{
            taskName: '',
            challengeID: undefined,
            description: '',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            taskType: 'quiz', 
            verificationMethod: 'manual', 
            playerLevel: '1',
            certified: 'yes', 
            badge: 'yes', 
            createdBy: 'admin',
            
            winMark: undefined,
            quizType: 'psychological',
            taskPercent: undefined,
            taskVariety: '',
            live: undefined,
            rank: undefined
          },
      });

      const CreateNewTask = (data) => {
        const token = localStorage.getItem("token");
        console.log("json fsdfsfse", token);
        return axios.post('/home/api/addtask', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      };

      const onSubmit = async (values) => {
        console.log("sefesf", values)
        setIsLoading(true);
        try {
          const resp = await CreateNewTask(values);
          console.log('Response:', resp);
    
          if (resp && resp.status === 201) {
            toast.success('Task created successfully!');
            // form.reset();
          } else {
            toast.error('Failed to create task.');
          }
        } catch (error) {
          console.error('Error creating Task:', error);
          toast.error('Error: Failed to create Task.');
        } finally {
          setIsLoading(false);
        }
        
      }

      const getChallenges = async () => {
        setIsChallengeLoading(true)
        try {
          const token = localStorage.getItem('token');
          const resp = await globalApi.GetChallenge(token);
          console.log('Response: of reqqq',resp.data);
          setChallenges(resp.data); 
        } catch (error) {
          console.error('Error Fetching Challenges data:', error);
          toast.error('Error: Failed to Fetch data.');
        }finally {
          setIsChallengeLoading(false);
        }
        
      }

      // Transforming challenges data to match the dropdownFields format
      const challengeList = challenges.map(challenge => ({
        label: challenge.title, 
        value: challenge.challenge_id,  
      }));

      useEffect(()=>{
        getChallenges() /* Calling when page loads */
      }, [])

        if (pageLoading) {
          return <LoadingOverlay loadText={"Loading..."}/>;
        }

      return (
        <div className='w-full px-4'>

          <div className="container mx-auto px-4 bg-slate-100">
                <h1 className='text-3xl mt-3'>Create New Task</h1>
                <p>Create Task</p>
          </div>
          <div className="container mx-auto mt-3 mb-5 p-5 bg-slate-100">
            <Toaster
              position="top-center"
              reverseOrder={false}
              />
            <Form {...form}>
              {isLoading && <LoadingOverlay loadText="Submitting..."/>}
              <form onSubmit={form.handleSubmit(onSubmit)} >
                {/* Title */}
                <FormField
                  control={form.control}
                  name="taskName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a Task Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="challengeID"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Challenge Name</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? challengeList.find(
                                    (type) => type.value === field.value
                                  )?.label
                                : "Select a Challenge"}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                        {isChallengeLoading?
                        <div className='flex items-center justify-center p-2'>
                          <LoaderIcon className="mr-2  inline-block animate-spin" />
                          Loading...
                        </div>:
                          <Command>
                            <CommandInput
                              placeholder="Search challenge..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No challenge found.</CommandEmpty>
                              <CommandGroup>
                                {challengeList.map((type) => (
                                  <CommandItem
                                    value={type.label}
                                    key={type.value}
                                    onSelect={() => {
                                      console.log("type.value",type);
                                      form.setValue("challengeID", type.value)
                                    }}
                                  >
                                    {type.label}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        type.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                  }
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className='flex flex-col justify-end ' style={{ margin: 0, padding: 0 }} >
                    <FormLabel>Description</FormLabel>
                    
                    <FormControl>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="col-span-1" variant="outline">Enter a Description</Button>
                        </DialogTrigger>
                        <DialogContent className="w-[90vw] max-w-[800px] h-[90vh] max-h-[600px]">
                          <DialogHeader>
                            <DialogTitle>Description</DialogTitle>
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
                                field.onChange(data); // Update form field value
                              }}
                            />

                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="submit">Done</Button>
                            </DialogClose>
                            
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <div className="grid grid-cols-4 grid-rows-1 gap-4 mt-5">
                  {/* DAte Range */}
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              // onSelect={field.onChange}
                              onSelect={(date) => {
                                field.onChange(date);
                                setStartDate(date); 
                              }}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
    
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                startDate ? date < startDate : date < new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
    
                {/* Start Time */}
                <TimeInput form={form} name={"startTime"} label={"Start Time"}/>
  
                {/* End Time  */}
                <TimeInput form={form} name={"endTime"} label={"End Time"}/>
    
  
              </div>
    
                <div className="grid grid-cols-4 grid-rows-1 gap-4 mt-5">
                  
                  {/* <!-- First dropdown --> */}
                  {/* <Dropdown form={form} name={"taskType"} label={"Task Type"} placeholder={"Select task Type"} dropdownFields={taskType} isDisabled={false}/> */}
                  <FormField
                      control={form.control}
                      name="taskType"
                      render={({ field }) => (
                      <FormItem className="flex flex-col end">
                          <FormLabel>Task Type</FormLabel>
                          <Popover>
                          <PopoverTrigger asChild>
                              <FormControl className="h-full px-4 py-2">
                              <Button 
                                  disabled
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                  )}
                              >
                                  {field.value
                                  ? taskTypes.find(
                                      (type) => type.value === field.value
                                      )?.label
                                  : "Select the task type" }
                                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                              </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                              <Command>
                              <CommandList>
                                  <CommandGroup>

                                  {taskTypes.map((type) => (
                                      <CommandItem
                                      key={type.value}
                                      onSelect={() => {
                                          field.onChange(type.value);
                                          setTaskType(type.value)
                                            form.resetField('latitude');
                                            form.resetField('longitude');
                                            form.resetField('radius');
                                            form.resetField('mediaTitle');
                                            form.resetField('mediaType');
                                            form.resetField('mediaDuration');
                                      }}
                                      >
                                      {type.label}
                                      <CheckIcon
                                          className={cn(
                                          "ml-auto h-4 w-4",
                                          type.value === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                      />
                                      </CommandItem>
                                  ))}
                                  </CommandGroup>
                              </CommandList>
                              </Command>
                          </PopoverContent>
                          </Popover>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
  
                </div>
    
                <div className="grid grid-cols-4 grid-rows-1 gap-4 mt-5">

                  {/* <!-- Second dropdown --> */}
                  <Dropdown form={form} name={"verificationMethod"} label={"Verification Method"} placeholder={"Select a  Verification Method"} dropdownFields={verifyMethod} isDisabled={true}/>

                  {/* Player Level */}
                  <InputNumber form={form} name={"playerLevel"} label={"Player Level"} placeholder={"Enter a value"} isDisabled={true}/>

                </div>

                {/* Win Mark */}
                <InputNumber form={form} name={"winMark"} label={"Win Mark "} placeholder={"Enter a value"} />
                
                {/* <!-- Quiz Type --> */}
                <Dropdown form={form} name={"quizType"} label={"Quiz Type"} placeholder={"Select a  Quiz Type"} dropdownFields={quizTypes} isDisabled={true}/>
                
                {/* Task Percent */}
                <InputNumber form={form} name={"taskPercent"} label={"Task Percent"} placeholder={"Enter a value"} />

                {/* <!-- task_variety --> */}
                <Dropdown form={form} name={"taskVariety"} label={"Task Variety"} placeholder={"Select"} dropdownFields={taskVarieties} />
                
                {/* <!-- Live --> */}
                <Dropdown form={form} name={"live"} label={"Live"} placeholder={"Select"} dropdownFields={enumType} />

                
                {/* Rank */}
                <InputNumber form={form} name={"rank"} label={"Rank"} placeholder={"Enter a value"}/>
    
              <div className='mt-5'>
                {/* Created By  */}
                <InputText form={form} name={"createdBy"} label={"Created By"} placeholder={"Enter name"} isDisabled={true}/> 
              </div>
 
              <Button type="submit" disabled={isLoading} className="mt-5">
                {isLoading ? (
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

export default pages
