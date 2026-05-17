"use server"

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

export async function getInterviewsByUserId(userId:string):Promise<Interview[] | null>{
  const interviews=await db
     .collection("interviews")
     .where("userId","==",userId)
     .orderBy("createdAt","desc")
     .get()

     return interviews.docs.map((doc)=>({
      id:doc.id,
      ...doc.data(),
     })) as Interview[]
}

export async function getLatestInterviews(params: GetLatestInterviewsParams):Promise<Interview[] | null>{
  const { userId, limit = 20 } = params;

  const interviews=await db
     .collection("interviews")
     .orderBy("createdAt","desc")
     .where("finalized", "==", true)
     .where("userId", "!=", userId)
     .limit(limit)
     .get();

     return interviews.docs.map((doc)=>({
      id:doc.id,
      ...doc.data(),
     })) as Interview[]
}

export async function getInterviewById(id:string):Promise<Interview | null>{
  const interview=await db.collection("interviews").doc(id).get()

  return interview.data() as Interview | null
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map((sentence: { role: string; content: string }) =>
        `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories.

        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not be lenient — be accurate and honest:
        - Communication Skills: Clarity, articulation, structured responses.
        - Technical Knowledge: Understanding of key concepts for the role.
        - Problem Solving: Approach to challenges and critical thinking.
        - Cultural Fit: Alignment with company values and role expectations.
        - Confidence and Clarity: Poise and decisiveness in responses.
      `,
      system:
        "You are a professional interviewer. Analyze the transcript and return a structured evaluation in JSON.",
    });

    const feedbackRef = feedbackId
      ? db.collection("feedback").doc(feedbackId)
      : db.collection("feedback").doc();

    await feedbackRef.set({
      interviewId,
      userId,
      ...object,
      createdAt: new Date().toISOString(),
    });

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("FEEDBACK ERROR:", error);
    return { success: false };
  }
}

export async function getFeedbackByInterviewId(params:GetFeedbackByInterviewIdParams):Promise<Feedback | null>{
  const {interviewId,userId}=params

  const querySnapshot=await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get()

    if(querySnapshot.empty) return null

    const feedbackDoc=querySnapshot.docs[0]
    return {id: feedbackDoc.id, ...feedbackDoc.data()} as Feedback
}