"use client"

import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import globalApi from '@/app/_services/globalApi'
import { LoaderIcon } from 'react-hot-toast'
import LoadingOverlay from '@/app/_components/LoadingOverlay'

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required')
})

function page() {

    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()
    const router = useRouter();

    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        router.push('/home'); /* Checking is the page already authenticated  */
      } else {  
          setPageLoading(false);
        }
    }, []);

    // const setdata = async()=>{
    //     try{
    //       const response = await globalApi.SetDemoPage();
    //       // Check response status
    //       if (response.status === 200) {

    //           alert("success")
    //       } else {
    //         alert('Unexpected status:', response.status);
            
    //       }
    //   } catch (error) {
          
    //       let errorMessage = "An unexpected error occurred.";
    //       if (error.response && error.response.data && error.response.data.message) {
    //           errorMessage = error.response.data.message;
    //       }

    //       alert("errrrr", errorMessage)
    //   } finally {
    //       setIsLoading(false);
    //   }
    //   }

    // useEffect(()=>{
    //   setdata()
      
    // },[])
    
    const form = useForm({
      resolver: zodResolver(FormSchema),
      defaultValues: {
          email: "",
          password: ""
      },
    })

    const handleNavigation = () => {
      toast({
        variant: "default",
        title: "Registration success.",
        description: response.data.message,
        action: <ToastAction altText="Done">Done</ToastAction>,
    });

    };

    if (pageLoading) {
      return <LoadingOverlay loadText={"Loading..."}/>;
    }

    const onSubmit = async(data)=> {
      setIsLoading(true)
      try {
          console.log("incoming data", data);
          const response = await globalApi.LoginAdmin(data);
          // Check response status
          if (response.status === 200) {

              localStorage.setItem('token', response.data.token);

              toast({
                  variant: "default",
                  title: "Login success.",
                  description: response.data.message,
                  action: <ToastAction altText="Done">Done</ToastAction>,
              });

              form.reset(); // Resetting the form
              router.push("/home"); // Moving to the home page
          } else {
              console.log('Unexpected status:', response.status);
              toast({
                  variant: "destructive",
                  title: "Login error.",
                  description: "An unexpected error occurred.",
                  action: <ToastAction altText="Try again">Try again</ToastAction>,
              });
          }
      } catch (error) {
          
          let errorMessage = "An unexpected error occurred.";
          if (error.response && error.response.data && error.response.data.message) {
              errorMessage = error.response.data.message;
          }

          toast({
              variant: "destructive",
              title: "Registration error.",
              description: errorMessage,
              action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
      } finally {
          setIsLoading(false);
      }
    } 

    return (

      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-md">
          <div className="p-6 bg-gray-600 text-white">
            <h2 className="text-2xl font-semibold text-center">Login to your account 
            </h2>
          </div>
          <div className="p-6">
            <div id="authForm">
              <Form {...form} >
                  <div className='grid gap-6'>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 ">
                          <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                  <Input  placeholder="Enter your email" disabled={isLoading} {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                          />

                          <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                  <Input type="password" placeholder="Enter a password" disabled={isLoading} {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                          />

                          <Button className="w-full" type="submit" disabled={isLoading}>
                              {isLoading ? (
                              <>
                                  <LoaderIcon className="mr-2 inline-block animate-spin" />
                                  Loading...
                              </>
                              ) : (
                              "Login"
                              )}
                          </Button>
                      </form>
                      
                      <div className='flex items-center justify-center'>
                          <p>Don't have an account ? </p>
                          <Button onClick={handleNavigation} className="p-2" variant="link">Register</Button>
                      </div>
                  </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
}

export default page
