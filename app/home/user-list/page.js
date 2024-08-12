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
  const [userData, setUserData] = useState([]);
  const [tableData, setTableData] = useState([]); 

  

  checkAuth(setPageLoading); /* Checking is the page authenticated  */

  useEffect(()=>{

    const getUsersData = async () => {
        // Check if we are in a browser environment
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        setIsLoading(true)
        try {
          const resp = await globalApi.GetAllUsers( token);
          console.log('Response: of reqqq',resp.data);
          setUserData(resp.data); 
        } catch (error) {
            if (error.response && error.response.data.error) {
                // Use the error message from the backend
                toast.error(error.response.data.error);
                console.error('Error Fetching Users data:', error);
            } else {
                // Fallback error message
                toast.error('An unexpected error occurred.');
            }
        }finally {
            setIsLoading(false);
        }
        
      }
    // Check if selectedChallenge has data before making the API call
    getUsersData();

  }, [])

  if (pageLoading) {
    return <LoadingOverlay loadText={"Loading..."}/>;
  }
  

  return (
    <div className='w-full px-4 bg-white'>
      <div className="container mx-auto px-4 bg-gray-100">
            <h1 className='text-3xl mt-3'>View All Users</h1>
            <p>View details</p>
      </div>
      <div className="container mx-auto mt-3 mb-5 p-5 shadow-md rounded-lg overflow-hidden w-full">
        <Toaster
          position="top-center"
          reverseOrder={false}
          />

        <div className='flex justify-between items-center bg-gray-100 p-5'>

            {   
                selectedChallenge &&
                <h1 className='font-bold text-3xl'>
                All Users
                </h1>
            }

            {/* <Button variant="outline" >
                <PlusIcon className="mr-2 h-4 w-4" /> Add a new Challenge
            </Button> */}

        </div>

        <div className="">

            <DataTable tableData={userData} setTableData={setUserData}/>

        </div>

      </div>


      
    </div>
  )
}

export default page
