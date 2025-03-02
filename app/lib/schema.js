import { z } from "zod";

export const onboardingSchema = z.object({
  industry: z.string({
    required_error: "Please select an industry",
  }),
  subIndustry: z.string({
    required_error: "Please select a specialization",
  }),
  bio: z.string().max(500).optional(),
  experience: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(0, "Experience must be at least 0 years")
        .max(50, "Experience cannot exceed 50 years")
    ),
  skills: z.string().transform((val) =>
    val
      ? val
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : undefined
  ),
});

export const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  mobile: z.string().optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").optional(),
  twitter: z.string().url("Invalid Twitter URL").optional(),
});

export const entrySchema = (type) =>
  z.object({
    title: z.string().min(1, {
      message:
        type === "Education"
          ? "Please enter your degree or program name."
          : type === "Project"
          ? "Please enter the title of your project."
          : "Please enter your job title or position.",
    }),
    organization: z.string().min(1, {
      message:
        type === "Education"
          ? "Please enter the name of your school or institution."
          : type === "Project"
          ? "Please enter the name of your project or organization."
          : "Please enter the name of the company or organization.",
    }),
    startDate: z.string().min(1, "Please select a start date."),
    endDate: z.string().optional(),
    description: z.string().min(1, {
      message:
        type === "Education"
          ? "Please describe your academic achievements or coursework."
          : type === "Project"
          ? "Please describe the project, including your role and outcomes."
          : "Please describe your role and achievements in this position.",
    }),
    current: z.boolean().default(false),
    ...(type === "Education"
      ? {
          location: z.string().optional(),
          boardUniversity: z.string().optional(),
          gradePercentage: z.string().optional(),
          fieldOfStudy: z.string().optional(),
          achievements: z.string().optional(),
        }
      : {}),
  });
  export const resumeSchema = z.object({
    contactInfo: contactSchema,
    summary: z.string().min(1, "Professional summary is required"),
    skills: z.string().min(1, "Skills are required"),
    experience: z.array(entrySchema("Experience")), // Pass "Experience" as the type
    education: z.array(entrySchema("Education")),   // Pass "Education" as the type
    projects: z.array(entrySchema("Project")),      // Pass "Project" as the type
  });

export const coverLetterSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});