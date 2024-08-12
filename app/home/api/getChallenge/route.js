import { authenticate } from "@/lib/jwtMiddleware";
import { db } from "@/utils";
import { decrypt } from "@/utils/cryptoUtils";
import { CHALLENGES, TASKS } from "@/utils/schema";
import { NextResponse } from "next/server";


export async function GET(req) {
    console.log("Inthe request get challenges");
    
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
        return authResult.response;
    }

    const pageData = authResult.decoded_Data;
    const pageId = pageData.pageId;
    const Email = pageData.email;
    console.log("Logged in user:", pageData);  

  try {
      const results = await db.select().from(CHALLENGES).where({ page_id: pageId });


      if (!results.length) {
        //   return NextResponse.json({ error: 'No challenges found' }, { status: 204 });
          return NextResponse.json(null, { status: 204 });
      }

      const decryptedResults = results.map(result => ({
        ...result,
        challengeID: result.challenge_id,
        title: decrypt(result.title),
    }));

      return NextResponse.json(decryptedResults, { status: 200 });
  } catch (error) {
      console.error('Error fetching challenges:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}