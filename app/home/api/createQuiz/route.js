import { db } from "@/utils";
import { hashPassword } from "@/utils/bcryptUtils";
import { ANSWERS, QUESTIONS } from "@/utils/schema";
import { NextResponse } from "next/server";

import { authenticate } from "@/lib/jwtMiddleware";


const createQuiz = async (req) => {
  
  try {
    const authResult = await authenticate(req);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.response }, { status: 401 });
    }

    const pageData = authResult.decoded_Data;

    const data = await req.json(); 

    const { type, timer, video, audio, image, challengeID, taskID, questions } = data;

    console.log(type, timer, video, audio, image, challengeID, taskID, questions); 
    
    for (const question of questions) {
      // Save the question and get the generated ID
      const questionData = await db.insert(QUESTIONS).values({
        type,
        timer,
        video,
        audio,
        image,
        question: question.question,
        challenge_id: challengeID,
        task_id: taskID
      });

      console.log("logging the inserted wqustion");
      const questionID = questionData[0].insertId;
      console.log("logging the inserted  questionID" , questionID);
      // Save the answers for this question
      for (const answer of question.answers) {
        await db.insert(ANSWERS).values({
          question_id: questionID,
          answer_text: answer.text,
          answer: answer.is_correct,
          task_marks: answer.task_marks
        });
      }
    }

    return NextResponse.json({ message: 'Quiz Data created successfully' }, { status: 201 });

  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  }
}
// Handle POST requests
  export async function POST(req) {
    return await createQuiz(req);
}