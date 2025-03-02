import { getResume } from "@/actions/resume";
import ResumeBuilder from "./_components/resume-builder";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function ResumePage() {
  const { isOnboarded } = await getUserOnboardingStatus();
    if (!isOnboarded) {
      redirect('/onboarding');
    }
  try {
    const resume = await getResume();
    const initialContent = resume || {
      content: "",
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    };
    return (
      <div className="container mx-auto py-6">
        <ResumeBuilder initialContent={initialContent} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching resume data:", error);
    return <div>Failed to load resume. Please try again later.</div>;
  }
}
