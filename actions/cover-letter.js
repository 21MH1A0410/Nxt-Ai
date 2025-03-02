"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateCoverLetter(data) {

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
  Write a highly targeted and impactful cover letter for the ${data.jobTitle} position at ${data.companyName} for ${user.name}.
  
  Candidate Profile:
  - Name: ${user.name}
  - Industry: ${user.industry} (Specifically mention any experience relevant to the target company's industry)
  - Years of Experience: ${user.experience}
  - Core Skills: ${user.skills?.join(", ")} (Emphasize skills relevant to the job description)
  - Professional Summary: ${user.bio} (Focus on accomplishments related to the key responsibilities of the target role)
  
  Job Details:
  - Job Description: ${data.jobDescription} (Pay close attention to required technologies and key responsibilities)
  
  Specific Instructions:
  
  1. **Impactful Opening:** Start with a strong hook that connects the candidate's passion or key qualification to the company's mission.
  2. **Directly Address Job Requirements:** Mirror the language and keywords from the job description to demonstrate a clear understanding of the role.
  3. **Quantify Achievements:** Provide 2-3 specific examples of accomplishments with measurable results (e.g., percentages, numbers), using bullet points or a similar visually appealing format for clarity.
  4. **Company Research:** Demonstrate a thorough understanding of ${data.companyName}'s mission, values, and recent projects. Mention a specific project or initiative that resonates with the candidate and explain why.
  5. **Skills in Context:** Provide context for how the candidate's skills have been applied in previous roles and how they align with the job requirements.
  6. **Acknowledge and Address Skill Gaps (If Applicable):** If there are any minor skill gaps, acknowledge them and express eagerness to learn.
  7. **Strong Call to Action:** End with a clear and confident call to action, expressing interest in an interview and highlighting potential contributions to the company. Avoid redundant statements like "resume attached."
  8. **Personalization:** If possible, address the hiring manager by name.
  9. **Conciseness:** Keep the letter under 400 words, focusing on the most relevant information.
  10. **Markdown Formatting:** Use proper business letter formatting in markdown, including:
     - Candidate's contact information (if available)
     - Date
     - Hiring Manager's Name (if known, otherwise use title)
     - Company Address
     - Subject Line
     - Formal salutation and closing
  
  Output the cover letter in Markdown format.
  `;

  try {
    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw new Error("Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}
