"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

export async function generateCoverLetter(data) {

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
  Generate a highly targeted and impactful cover letter for the `${data.jobTitle}` position at `${data.companyName}` for `${user.name}`.

### **Candidate Profile:**  
- **Name:** `${user.name}`  
- **Industry:** `${user.industry}` (Highlight relevant experience related to `${data.companyName}`'s industry)  
- **Years of Experience:** `${user.experience}`  
- **Core Skills:** `${user.skills?.join(", ")}` (Emphasize the most relevant skills for this role)  
- **Professional Summary:** `${user.bio}` (Focus on accomplishments and expertise aligned with the job responsibilities)  

### **Job Details:**  
- **Job Title:** `${data.jobTitle}`  
- **Company Name:** `${data.companyName}`  
- **Job Description:** `${data.jobDescription}` 
---

### **Cover Letter Generation Instructions:**  

1. **Ensure Proper Line Breaks & Spacing:**  
   - Use `\n` between **paragraphs** to maintain clear separation.  
   - Do **not** merge sentences into a single block—each section should be clearly separated.  
   - Bullet points should be formatted with `- ` (dash + space) for proper readability.  

2. **Impactful Opening:**  
   - Start with a **strong first paragraph** that connects `${user.name}`'s passion or key qualifications to `${data.companyName}`'s mission.  

3. **Directly Address Job Requirements:**  
   - Use exact wording from `${data.jobDescription}` where relevant.  
   - Keep each key point **in a separate paragraph** for clarity.  

4. **Quantify Achievements:**  
   - Present **2-3 measurable accomplishments** using **bullet points**, formatted as follows:  
     ```
     - **[Achievement]**: Improved [metric] by [percentage or impact] using [skill].  
     - **[Achievement]**: Led [project], resulting in [measurable outcome].  
     ```  

5. **Company Research & Personalization:**  
   - Mention a **specific project, value, or initiative** of `${data.companyName}`.  
   - Ensure this **is in a dedicated paragraph** with a clear transition.  

6. **Strong Call to Action:**  
   - End with a dedicated **closing paragraph**, including a direct request for an interview.  
   - Do not include redundant phrases like "resume attached" or "please find enclosed."  

7. **Formatting Guidelines (Markdown for Business Letter):**  
   - maku sure to set line breaks for lengthy lines in a paragraph.  
   - Use **bold** (`**text**`) for key highlights (e.g., job title, company name, key skills).  
   - The letter should include:  
     - **Candidate’s Contact Information**  
     - **Date**  
     - **Hiring Manager’s Name (if available) & Company Address**  
     - **Subject Line**  
     - **Formal Salutation & Closing**  
     - **Bullet points where necessary**  

---
**Output the cover letter in Markdown format with proper spacing and structure.**  

---

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
