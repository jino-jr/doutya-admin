import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table" 
import globalApi from '@/app/_services/globalApi'
import { LoaderIcon } from 'react-hot-toast'
import { Loader2Icon, LoaderCircleIcon } from 'lucide-react'

function SearchDialogue(props) {

    const {selectedChallenge, setSelectedChallenge } = props
    const [isLoading, setIsloading] = useState(false)
    const [challenges, setChallenges] = useState([]);


    /* To get all challenge on page load */
    useEffect(()=>{

        const getChallenges = async () => {
            setIsloading(true)
            try {
              const token = localStorage.getItem('token');
              const resp = await globalApi.GetChallenge(token);
              console.log('Response: of reqqq',resp.data);
              setChallenges(resp.data); 
            } catch (error) {
              console.error('Error Fetching Challenges data:', error);
              toast.error('Error: Failed to Fetch data.');
            }finally {
                setIsloading(false);
            }
          }
        getChallenges()

    }, [])

    const handleRowClick = (challenge) => {
        console.log(`Challenge ID: ${challenge.challenge_id}`);
        const { title, challenge_id: challengeId } = challenge;
        setSelectedChallenge({ title, challengeId });
        // Perform actions based on the clicked challengeId
    };

  return (
    <div className='mt-10 border-solid border-2 border-gray-400 rounded-md p-3'>
        <Table className="min-h-[350px]">
            <TableCaption>List of all challenges.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">Id</TableHead>
                <TableHead>Challenge Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead className="text-right">Start Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="w-full">
                {
                    isLoading ? 
                    <div className="flex items-center justify-center w-full h-full">
                        <LoaderCircleIcon className="w-32 h-32 animate-spin" />
                    </div>:
                    (
                        challenges?
                        challenges.map((challenge, index)=>(
                            // <div className=''>
                                <TableRow key={index} 
                                className={`cursor-pointer ${selectedChallenge.challengeId === challenge.challenge_id ? 'bg-blue-200' : ''}`}
                                        onClick={() => handleRowClick(challenge)}
                                >
                                    <TableCell >{challenge.challenge_id}</TableCell>
                                    <TableCell className="font-medium">{challenge.title}</TableCell>
                                    <TableCell>{challenge.start_date}</TableCell>
                                    <TableCell className="">{challenge.end_date}</TableCell>
                                </TableRow> 
                        ))
                            :  (
                            <div className='w-full'>
                                <p className='text-center'>No Challenges Createsd</p>
                            </div>
                            )
                    )
                }

            </TableBody>
        </Table>
    </div>
  )
}

export default SearchDialogue
