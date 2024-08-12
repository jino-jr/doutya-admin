"use client"

import { Button } from '@/components/ui/button';
import { checkAuth } from '@/hooks/checkAuth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import LoadingOverlay from '../_components/LoadingOverlay';


function page() {
  const [pageLoading, setPageLoading] = useState(true);
  checkAuth(setPageLoading); /* Checking is the page authenticated  */

  if (pageLoading) {
    return <LoadingOverlay loadText={"Loading..."}/>;
  }

  const router = useRouter();
  const handleClick = (index) => {
    const path = ["/home/tasks", "/home/challenge", "/home/questions", "/home/taskStats", "/home/user-list"]
    router.push(path[index]);
  };

  const handleLogout = () =>{
    localStorage.removeItem('token');
    router.push('/auth/login')
  }

  return (
    <div>

      <div className="p-5 bg-slate-100 flex items-center justify-between">
        <div className="font-bold">SAMPLE HOME</div>

        <div className="">
          <Button onClick={handleLogout}>Logout</Button>
        </div>

      </div>

      <div className='grid grid-col-3 w-full justify-center'>
        <div className="container mt-5 col-span-3">
          <Button className="w-full h-[60px]" onClick={() => handleClick(1)}>Create New Challenge</Button>
        </div>
  
        <div className="container mt-5 col-span-3">
          <Button className="w-full h-[60px]" onClick={() => handleClick(0)}>Create New Task</Button>
        </div>
  
        <div className="container mt-5 col-span-3">
          <Button className="w-full h-[60px]" onClick={() => handleClick(2)}>Create New Quiz Data</Button>
        </div>
  
        <div className="container mt-5 col-span-3">
          <Button className="w-full h-[60px]" onClick={() => handleClick(3)}>View All Tasks Data</Button>
        </div>
  
        <div className="container mt-5 col-span-3">
          <Button className="w-full h-[60px]" onClick={() => handleClick(4)}>View All User Data</Button>
        </div>
  
      </div>
    </div>
  )
}

export default page
