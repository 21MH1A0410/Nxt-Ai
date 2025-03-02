import { getAssessments } from "@/actions/interview";
import QuizList from "./_components/quiz-list";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const InterviewPage = async () =>{
    const {isOnboarded} = await getUserOnboardingStatus();
      if(!isOnboarded){
        redirect('/onboarding');
      }
    const assessments = await getAssessments();
    if(!assessments?.length){
        redirect('/interview/mock');
    }
    return( 
        <div>
            <div>
                <h1 className="text-6xl font-bold gradient-title mb-5">
                    Interview Preparation
                </h1>

                <div className="space-y-6">
                    <StatsCards assessments={assessments} />
                    <PerformanceChart assessments={assessments} />
                    <QuizList assessments={assessments} />
                </div>
            </div>
        </div>
    );
}

export default InterviewPage;