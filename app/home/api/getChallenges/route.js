import { db } from "@/utils";
import { decrypt } from "@/utils/cryptoUtils";
import { CHALLENGES } from "@/utils/schema";
import { NextResponse } from "next/server";

export async function GET(req){

    const results = await db.select().from(CHALLENGES)
    const decryptedResults = results.map(result => ({
        ...result,
        challengeID: result.challenge_id,
        title: decrypt(result.title),
    }));

    return NextResponse.json(decryptedResults)
}