import { db } from "@/utils";
import { decrypt } from "@/utils/cryptoUtils";
import { TASKS } from "@/utils/schema";
import { NextResponse } from "next/server";


export async function GET(request, { params }) {
    const { id } = params;

  if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
  }

  try {
      const results = await db.select().from(TASKS).where({ challenge_id: id });

      if (!results.length) {
          return NextResponse.json({ error: 'No tasks found for the selected challenge' }, { status: 404 });
      }

      const decryptedResults = results.map(result => ({
          ...result,
          task_name: decrypt(result.task_name),
      }));

      return NextResponse.json(decryptedResults, { status: 200 });
  } catch (error) {
      console.error('Error fetching tasks:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}