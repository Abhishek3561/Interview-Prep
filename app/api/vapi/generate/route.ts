import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function POST(request: Request) {
  try {
    const { type, role, level, techstack, amount, userid } = await request.json();

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      providerOptions: {
        google: {
          responseMimeType: "application/json",
        },
      },
      prompt: `Prepare interview questions based on these details:
        Job Role: ${role}
        Experience Level: ${level}
        Tech Stack: ${techstack}
        Focus (Behavioral/Technical/Mixed): ${type}
        Total Number of Questions: ${amount}

        CRITICAL: The questions will be read by a voice assistant. Do not use special characters like "/", "*", or markdown symbols that could break speech synthesis.
        
        You MUST return your response as a valid, parsable JSON array of strings containing ONLY the questions, exactly like this format:
        ["Question 1", "Question 2"]`,
    });

    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedQuestions = JSON.parse(cleanedText);

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(",").map((tech: string) => tech.trim()),
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error:", error);
    return Response.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}