"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast, { LoaderIcon, Toaster } from 'react-hot-toast';
import globalApi from '@/app/_services/globalApi';
import { TaskDetails } from '../TaskDetails.jsx';
import LoadingOverlay from '@/app/_components/LoadingOverlay.jsx';


const page = ({ params }) => {
  const userId = params.userId;

  const [userData, setUserData] = useState({ userDetails: [], userTasks: [] });  
  const [isLoading, setIsLoading] = useState(false);

  // const { id } = router.query;
  const userTaskDetails = userData.userTasks;

  // Destructure safely
  const userDetails = userData.userDetails[0] || {};
  
  const {
    name,
    username,
    email,
    gender,
    mobile,
    birth_date,
    country,
    state,
    location,
    achievement,
    referral_id,
    account_status,
    education,
    resume,
    student,
    college,
    university,
    yearOfPassing,
    monthOfPassing,
  } = userDetails;

  console.log(name);
  
  useEffect(()=>{
    const getUserData= async () => {
      setIsLoading(true)
      try {
        // const resp = await globalApi.GetAllTasks(challengeID);
        const token = localStorage.getItem('token');
        const resp = await globalApi.GetUserData(userId, token)
        console.log('Response: of reqqq',resp.data);
        setUserData(resp.data); 
      } catch (error) {
        if (error.response && error.response.data.error) {
          // Use the error message from the backend
          toast.error(error.response.data.error);
          console.error('Error Fetching User data:', error);
        } else {
          // Fallback error message
          toast.error('An unexpected error occurred.');
        }
      } finally {
        setIsLoading(false)
      }
    }

    if(userId){
      getUserData()
    }
  }, [userId])

  if (isLoading) {
    return <LoadingOverlay loadText={"Loading..."}/>;
  }
  

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 rounded-xl shadow-lg">
      <Toaster
      position="top-center"
      reverseOrder={false}
      />
      {/* Header Section */}
      <div className="flex items-center space-x-6 mb-10">
        <Image
          src="/user_sample.svg" // Replace with actual user image
          alt={`${name}'s Profile Picture`}
          width={120}
          height={120}
          className="rounded-full border-4 border-blue-500"
        />
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">{name}</h1>
          <p className="text-lg text-gray-600">@{username}</p>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h2>
          <p><strong className="text-gray-600">Email:</strong> {email}</p>
          <p><strong className="text-gray-600">Gender:</strong> {gender}</p>
          <p><strong className="text-gray-600">Mobile:</strong> {mobile}</p>
          <p><strong className="text-gray-600">Birth Date:</strong> {birth_date}</p>
          <p><strong className="text-gray-600">Location:</strong> {location || 'N/A'}, {state}, {country}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Additional Information</h2>
          <p><strong className="text-gray-600">Achievement Points:</strong> {achievement}</p>
          <p><strong className="text-gray-600">Referral ID:</strong> {referral_id || 'N/A'}</p>
          <p><strong className="text-gray-600">Account Status:</strong> {account_status}</p>
          <p><strong className="text-gray-600">Student:</strong> {student}</p>
          <p><strong className="text-gray-600">Education:</strong> {education || 'N/A'}</p>
        </div>
      </div>

      {/* Academic Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Academic Details</h2>
        <p><strong className="text-gray-600">College:</strong> {college || 'N/A'}</p>
        <p><strong className="text-gray-600">University:</strong> {university || 'N/A'}</p>
        <p><strong className="text-gray-600">Year of Passing:</strong> {yearOfPassing || 'N/A'}</p>
        <p><strong className="text-gray-600">Month of Passing:</strong> {monthOfPassing || 'N/A'}</p>
      </div>

      {/* Academic Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <TaskDetails tableData={userTaskDetails} />
      </div>

      {/* Footer Section */}
      <div className="flex justify-between items-center">
        <a
          href={resume ? resume : '#'}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          download
        >
          Download Resume
        </a>
        <button
          onClick={() => router.back()}
          className="bg-gray-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-700 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default page;
