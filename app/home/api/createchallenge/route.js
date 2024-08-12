import { db } from "@/utils";
import { hashPassword } from "@/utils/bcryptUtils";
import { CHALLENGES, USER_DETAILS } from "@/utils/schema";
import { NextResponse } from "next/server";
import { z } from 'zod';
import { eq } from 'drizzle-orm'
import { authenticate } from "@/lib/jwtMiddleware";
import { encrypt } from "@/utils/cryptoUtils";


const createChallenge = async (req) => {
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
        return authResult.response;
      }

    const pageData = authResult.decoded_Data;
    const pageId = pageData.pageId;
    const Email = pageData.email;
    console.log("Logged in user:", pageData);  

    const data = await req.json(); 
    
    const encryptedTitle = encrypt(data?.title);
    const encryptedDescription = encrypt(data?.description);

    const result = await db.insert(CHALLENGES).values({   
        page_id: pageId,
        title: encryptedTitle,
        description: encryptedDescription,
        challenge_type: data?.challengeType.toLowerCase(),
        frequency: data?.frequency.toLowerCase(),
        start_date: new Date(data.startDate),
        start_time: data?.startTime, 
        end_date: new Date(data.endDate),
        end_time: data?.endTime,
        entry_points: parseInt(data?.entryPoints, 10), 
        reward_points: parseInt(data?.rewardPoints, 10),
        level: parseInt(data?.level, 10) || 1,
        created_by: data?.createdBy,
        created_date: new Date(),
        participants_count: parseInt(data?.participantsCount, 10) || 0,
        removed_date: data?.removedDate ? new Date(data.removedDate) : null,
        removed_by: data?.removedBy,
        arena: data?.arena.toLowerCase(),
        district_id: data?.districtId ? parseInt(data?.districtId, 10) : null,
        visit: data?.visit.toLowerCase(),
        active: data?.active.toLowerCase(),
        days: parseInt(data?.days, 10) || 0, 
        referral_count: parseInt(data?.referralCount, 10) || 0, 
        open_for: data?.openFor.toLowerCase(),
        like_based: data?.likeBased.toLowerCase(),
        live: data?.live.toLowerCase(),
        questions: parseInt(data?.questions, 10) || 0,
        // exp_type: data?.expType.toLowerCase(),
        // rewards: data?.rewards.toLowerCase(),
        dep_id: parseInt(data?.depId, 10) || 1,
        page_type: data?.pageType.toLowerCase(),
        rounds: parseInt(data?.rounds, 10),
        start_datetime: new Date(),
        language_id: parseInt(data?.languageId, 10) || 1,
     });

  
    return NextResponse.json({ message: 'Challenge created successfully' }, { status: 201 });
  };
  
//    Handle POST requests
  export async function POST(req) {
    return await createChallenge(req);
  }