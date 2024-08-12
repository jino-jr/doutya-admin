import { authenticate } from "@/lib/jwtMiddleware";
import { db } from "@/utils";
import { decrypt } from "@/utils/cryptoUtils";
import { USER_DETAILS } from "@/utils/schema";
import { NextResponse } from "next/server";


export async function GET(req) {
    
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
        return authResult.response;
    }

    const pageData = authResult.decoded_Data;
    const pageId = pageData.pageId;
    const Email = pageData.email;
    console.log("Logged in user:", pageData);  

  try {
      const results = await db.select().from(USER_DETAILS);

      if (!results.length) {
          return NextResponse.json({ error: 'No Users found' }, { status: 404 });
      }

      return NextResponse.json(results, { status: 200 });
  } catch (error) {
      console.error('Error fetching user data:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}