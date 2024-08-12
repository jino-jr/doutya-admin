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
import InputText from '@/app/_components/InputText'
import Dropdown from '@/app/_components/Dropdown'

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  mobile: z.string().regex(/^\d{10}$/, {
    message: "Mobile number must be 10 digits.",
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long.'
  }),
  gender: z.enum(['male', 'female', 'other', 'PreferNotToSay'], {
    message: 'Gender is required.',
  }),
  birth_date: z.string().refine((val) => {
    return !isNaN(Date.parse(val));
  }, {
    message: "Invalid date format.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  education: z.string().min(2, {
    message: "Education must be at least 2 characters.",
  }),
  college: z.string().min(2, {
    message: "College must be at least 2 characters.",
  }),
  university: z.string().min(2, {
    message: "University must be at least 2 characters.",
  }),
  student: z.enum(['yes', 'no'], {
    message: 'Student status is required.',
  }),
  yearOfPassing: z.string().min(1, {
    message: "Year of Passing is required.",
  }),
  monthOfPassing: z.string().min(1, {
    message: "Month of Passing is required.",
  }),
  resume: z.string().url({
    message: "Invalid URL.",
  }),
});

const genders = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
  { label: "Prefer not to say", value: "PreferNotToSay" },
];

const yesNo = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];


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

 
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      mobile: "",
      password: "",
      gender: "", 
      birth_date: "",
      country: "",
      state: "",
      location: "",
      education: "",
      college: "",
      university: "",
      student: "", 
      yearOfPassing: "",
      monthOfPassing: "",
      resume: "",
    },
  });

  if (pageLoading) {
    return <LoadingOverlay loadText={"Loading..."}/>;
  }
  
  const handleNavigation = () => {
    router.push("/auth/login"); 
  };

  const onSubmit = async(data)=> {
    console.log("incoming data", data);
    setIsLoading(true);
    try {
        const response = await globalApi.RegisterUser(data);
    
        // Check response status
        if (response.status === 201) {
            toast({
                variant: "default",
                title: "Registration success.",
                description: response.data.message,
                action: <ToastAction altText="Done">Done</ToastAction>,
            });
    
            form.reset(); // Resetting the form
            router.push("/auth/login"); // Moving to the login page
        } else {
            console.log('Unexpected status:', response.status);
            toast({
                variant: "destructive",
                title: "Registration error.",
                description: "An unexpected error occurred.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
        }
    } catch (error) {
        console.log(error);
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
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-4xl" >
        <div className="p-6 bg-gray-600 text-white">
          <h2 className="text-2xl font-semibold text-center">Create an account</h2>
        </div>
        <div className="p-6">
          <div id="authForm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Username Field */}
                  <InputText form={form} name={'username'} label={'Username'} placeholder={"Enter username"} formClass={'col-span-1'} isDisabled={isLoading} />

                  {/* Name Field */}
                  <InputText form={form} name={'name'} label={'Name'} placeholder={"Enter username"} formClass={'col-span-1'} isDisabled={isLoading}/>


                  {/* Email Field */}
                  <InputText form={form} name={'email'} label={'Email'} placeholder={"Enter your email"} formClass={'col-span-1'} isDisabled={isLoading}/>

                  {/* Mobile Field */}
                  <InputText form={form} name={'mobile'} label={'Moble'} placeholder={"Enter your mobile number"} formClass={'col-span-1'} isDisabled={isLoading}/>

                  {/* Password Field */}
                  <InputText form={form} name={'password'} label={'Password'} placeholder={"Enter a password"} formClass={'col-span-1 md:col-span-2'} isDisabled={isLoading}/>

                  {/* Gender Field */}
                  <Dropdown form={form} name={'gender'} label={'Gender'} placeholder={"Your Gender"} dropdownFields={genders} formClass={'col-span-1'} isDisabled={isLoading}/>


                  {/* Birth Date Field */}
                  <FormField
                    control={form.control}
                    name="birth_date"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Birth Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} disabled={isLoading}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Country Field */}
                  <InputText form={form} name={'country'} label={'Country'} placeholder={"Enter your country"} formClass={'col-span-1 md:col-span-2 lg:col-span-1'} isDisabled={isLoading}/>

                  {/* State Field */}
                  <InputText form={form} name={'state'} label={'State'} placeholder={"Enter your state"} formClass={'col-span-1 md:col-span-2 lg:col-span-1'} isDisabled={isLoading}/>

                  {/* Location Field */}
                  <InputText form={form} name={'location'} label={'Location'} placeholder={"Enter your location"} formClass={'col-span-1 md:col-span-2 lg:col-span-1'} isDisabled={isLoading}/>

                  {/* Education Field */}
                  <InputText form={form} name={'education'} label={'Education'} placeholder={"Enter your education"} formClass={'col-span-1 md:col-span-2 lg:col-span-1'} isDisabled={isLoading}/>

                  {/* College Field */}
                  <InputText form={form} name={'college'} label={'College'} placeholder={"Enter your college"} formClass={'col-span-1 md:col-span-2 lg:col-span-1'} isDisabled={isLoading}/>

                  {/* University Field */}
                  <InputText form={form} name={'university'} label={'University'} placeholder={"Enter your university"} formClass={'col-span-1 md:col-span-2 lg:col-span-1'} isDisabled={isLoading}/>

                  {/* Student Field */}
                  <Dropdown form={form} name={'student'} label={'Student'} placeholder={"Are you a student?"} dropdownFields={yesNo} formClass={'col-span-1'} isDisabled={isLoading}/>

                  {/* Year of Passing Field */}
                  <FormField
                    control={form.control}
                    name="yearOfPassing"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2 lg:col-span-1">
                        <FormLabel>Year of Passing</FormLabel>
                          <FormControl>
                            <select {...field} className="w-full border border-gray-300 rounded-md p-2" disabled={isLoading}>
                              <option value="" disabled selected hidden>
                                Select Year of Passing
                              </option>
                              {Array.from({ length: 100 }, (_, i) => (
                                <option key={i} value={new Date().getFullYear() - i}>
                                  {new Date().getFullYear() - i}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Month of Passing Field */}
                  <FormField
                    control={form.control}
                    name="monthOfPassing"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2 lg:col-span-1">
                        <FormLabel>Month of Passing</FormLabel>
                          <FormControl>
                            <select {...field} className="w-full border border-gray-300 rounded-md p-2" disabled={isLoading}>
                              <option value="" disabled selected hidden>
                                Select Month of Passing
                              </option>
                              {Array.from({ length: 12 }, (_, i) => (
                                <option key={i} value={i + 1}>
                                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                {/* Resume Field */}
                <InputText form={form} name={'resume'} label={'Resume URL'} placeholder={"Paste resume URL"} formClass={'col-span-1 md:col-span-2 lg:col-span-1'} isDisabled={isLoading}/>

                </div>

                <Button className="w-full mt-6" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <LoaderIcon className="mr-2 inline-block animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>

                <div className='flex items-center justify-center mt-4'>
                  <p>Already have an account?</p>
                  <Button onClick={handleNavigation} className="p-2 ml-2" variant="link">Login</Button>
                </div>

                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>


  )
}

export default page