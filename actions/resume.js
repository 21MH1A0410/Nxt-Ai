"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function saveResume(resumeData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    // Ensure resumeData is an object
    if (!resumeData || typeof resumeData !== "object") {
      throw new Error("Invalid resume data.");
    }

    const resume = await db.resume.upsert({
      where: { userId: user.id },
      update: {
        content: resumeData.content || "",
        contactInfo: resumeData.contactInfo || {},
        summary: resumeData.summary || "",
        skills: resumeData.skills || "",
        experience: resumeData.experience || [],
        education: resumeData.education || [],
        projects: resumeData.projects || [],
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        content: resumeData.content || "",
        contactInfo: resumeData.contactInfo || {},
        summary: resumeData.summary || "",
        skills: resumeData.skills || "",
        experience: resumeData.experience || [],
        education: resumeData.education || [],
        projects: resumeData.projects || [],
      },
    });

    revalidatePath("/resume");
    return { message: "success" };
  } catch (error) {
    console.error("Error in saveResume:", error.message);
    throw new Error("Server action failed: Save resume" + error.message);
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const resume = await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });

  // Ensure the resume data is returned in the correct format
  return resume
    ? {
        content: resume.content || "",
        contactInfo: resume.contactInfo || {},
        summary: resume.summary || "",
        skills: resume.skills || "",
        experience: resume.experience || [],
        education: resume.education || [],
        projects: resume.projects || [],
      }
    : null;
}

export async function improveWithAI({ current, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords

    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error.message);
    throw new Error("Failed to improve content: " + error.message);
  }
}