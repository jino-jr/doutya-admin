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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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

import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
    } from "@/components/ui/command"
    
import { cn } from "@/lib/utils"
import { CheckIcon } from "@radix-ui/react-icons"

import {CaretSortIcon } from "@radix-ui/react-icons"
import globalApi from '@/app/_services/globalApi'
import toast, { LoaderIcon, Toaster } from 'react-hot-toast';
import LoadingOverlay from '../../_components/LoadingOverlay'
import { checkAuth } from '@/hooks/checkAuth'
import axios from 'axios'
import { PlusIcon } from 'lucide-react'

import SearchDialogue from './SearchDialogue'
import { DataTable } from './DataTable'


function page() {
  const [startDate, setStartDate] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [editorData, setEditorData] = useState('');

  const [selectedChallenge, setSelectedChallenge] = useState({})
  const [tasks, setTasks] = useState([]);
  const [tableData, setTableData] = useState([]); 

  console.log("selectedChallenge",selectedChallenge);
  
  console.log("selectedTasks",tasks);

  checkAuth(setPageLoading); /* Checking is the page authenticated  */

  const form = useForm({
    defaultValues: {
        taskID: "",
    },
  });

    // Reset tasks when challengeID changes
    useEffect(() => {
    if (selectedChallenge) {
        setTasks([]); // Reset tasks
        form.setValue('taskID', '')
    }
    }, [selectedChallenge]);

  useEffect(()=>{

    const getTasks = async () => {
        const token = localStorage.getItem("token");
        setIsLoading(true)
        try {
          const resp = await globalApi.GetTask(selectedChallenge.challengeId, token);
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
            setIsLoading(false);
        }
        
      }
    // Check if selectedChallenge has data before making the API call
    if (Object.keys(selectedChallenge).length > 0) {
        getTasks();
    }
  }, [selectedChallenge])

    // Transforming task data to match the dropdownFields format
    const taskList = tasks.map(task => ({
        label: task.task_name, 
        value: task.task_id,
    }));
    
    
    const handleSelect = async(id) => {
        // Perform actions based  the selected value
        setIsLoading(true);
        const token = localStorage.getItem("token");

        try {
            const resp = await globalApi.GetTableData(id, token);
            console.log('Response: of  TableTableTable',resp.data);
            setTableData(resp.data); 
          } catch (error) {
            console.error('Error Fetching Table data:', error);
            toast.error('Error: Failed to Fetch User List data.');
          }finally {
              setIsLoading(false);
          }
    };

  if (pageLoading) {
    return <LoadingOverlay loadText={"Loading..."}/>;
  }
  

  return (
    <div className='w-full px-4 bg-white'>
      <div className="container mx-auto px-4 bg-gray-100">
            <h1 className='text-3xl mt-3'>View Task Details</h1>
            <p>View details</p>
      </div>
      <div className="container mx-auto mt-3 mb-5 p-5 shadow-md rounded-lg overflow-hidden w-full">
        <Toaster
          position="top-center"
          reverseOrder={false}
          />


          {isLoading && <LoadingOverlay loadText={"Submitting..."}/>}
            <div className='flex justify-between items-center bg-gray-100 p-5'>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w=1/2" variant="default">Select a Challenge</Button>
                    </DialogTrigger>
                    <DialogContent className="w-[90vw] max-w-[800px] h-[90vh] max-h-[600px]">
                        <DialogHeader className={"h-10"}>
                            <DialogTitle>Challenges List</DialogTitle>
                            <DialogDescription>
                                Select a challenge from the list to get detailed view.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Content  */}

                        <SearchDialogue
                            selectedChallenge={selectedChallenge}
                            setSelectedChallenge={setSelectedChallenge}
                        />

                        <DialogFooter className={"absolute bottom-5 right-5"}>
                            <DialogClose asChild className={""}>
                                <Button type="submit">Done</Button>
                            </DialogClose>
                            
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {   
                    selectedChallenge &&
                    <h1 className='font-bold text-3xl'>
                    {selectedChallenge.title}
                    </h1>
                }

                <Button variant="outline" >
                    <PlusIcon className="mr-2 h-4 w-4" /> Add a new Challenge
                </Button>

            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Form {...form}>
                    <form className="space-y-6">
                        <FormField
                            control={form.control}
                            name="taskID"
                            render={({ field }) => (
                                <FormItem className={`flex flex-col justify-end col-span-2`} style={{ margin: 0, padding: 0 }}>
                                    <FormLabel>Task Type</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl className="h-10 px-4 py-2">
                                                <Button
                                                    disabled={tasks.length === 0}
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? taskList.find(type => type.value === field.value)?.label
                                                        : "Select Task Type"}
                                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0">
                                            <Command>
                                                <CommandList>
                                                    <CommandGroup>
                                                        {taskList.map((type) => (
                                                            <CommandItem
                                                                key={type.value}
                                                                onSelect={() => {
                                                                    field.onChange(type.value);
                                                                    handleSelect(type.value); // Call onSelect if provided
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
                    </form>
                </Form>
            </div>



            <div className="">

                <DataTable tableData={tableData} setTableData={setTableData}/>

            </div>
            



            {/* <Button type="submit" disabled={isLoading} className={"col-span-4"}>
                {isLoading ? (
                <>
                    <LoaderIcon className="mr-2 inline-block animate-spin" />
                    Submitting...
                </>
                ) : (
                "Submit"
                )}
            </Button> */}
          


      </div>


      
    </div>
  )
}

export default page
