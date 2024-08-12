import { db } from "@/utils";
import { decrypt } from "@/utils/cryptoUtils";
import { TASKS } from "@/utils/schema";
import { NextResponse } from "next/server";

export async function GET(req){

    const results = await db.select().from(TASKS)
    const decryptedResults = results.map(result => ({
        ...result,
        task_name: decrypt(result.task_name),
    }));

    return NextResponse.json(decryptedResults)
}