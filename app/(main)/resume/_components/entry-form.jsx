"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { entrySchema } from "@/app/lib/schema";
import { Sparkles, PlusCircle, X, Loader2 } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

export function EntryForm({ type, entries, onChange }) {
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema(type)),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
      ...(type === "Education"
        ? {
            location: "",
            boardUniversity: "",
            gradePercentage: "",
            fieldOfStudy: "",
            achievements: "",
          }
        : {}),
    },
  });

  const current = watch("current");

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    onChange([...entries, formattedEntry]);

    reset({
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
      ...(type === "Education"
        ? {
            location: "",
            boardUniversity: "",
            gradePercentage: "",
            fieldOfStudy: "",
            achievements: "",
          }
        : {}),
    });
    setIsAdding(false);
  });

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    try {
      await improveWithAIFn({
        current: description,
        type: type.toLowerCase(),
      });
    } catch (error) {
      toast.error("Failed to improve description. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {entries.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title} @ {item.organization}
              </CardTitle>
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => handleDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.current
                  ? `${item.startDate} - Present`
                  : `${item.startDate} - ${item.endDate}`}
              </p>
              <p className="mt-2 text-sm whitespace-pre-wrap">
                {item.description}
              </p>
              {type === "Education" && (
                <>
                  {item.location && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong>Location:</strong> {item.location}
                    </p>
                  )}
                  {item.boardUniversity && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong>Board/University:</strong> {item.boardUniversity}
                    </p>
                  )}
                  {item.gradePercentage && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong>Grade/Percentage:</strong> {item.gradePercentage}
                    </p>
                  )}
                  {item.fieldOfStudy && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong>Field of Study:</strong> {item.fieldOfStudy}
                    </p>
                  )}
                  {item.achievements && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong>Achievements:</strong> {item.achievements}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  placeholder={
                    type === "Education"
                      ? "Degree/Program Name (e.g., 10th, Inter, BTech)"
                      : type === "Project"
                      ? "Project Title"
                      : "Title/Position"
                  }
                  {...register("title")}
                  error={errors.title}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder={
                    type === "Education"
                      ? "Institution Name"
                      : type === "Project"
                      ? "Project Name"
                      : "Organization/Company"
                  }
                  {...register("organization")}
                  error={errors.organization}
                />
                {errors.organization && (
                  <p className="text-sm text-red-500">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>

            {type === "Education" && (
              <>
                <div className="space-y-2">
                  <Input
                    placeholder="Location (e.g., New York, USA)"
                    {...register("location")}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500">{errors.location.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Board/University (e.g., CBSE, Harvard University)"
                    {...register("boardUniversity")}
                  />
                  {errors.boardUniversity && (
                    <p className="text-sm text-red-500">{errors.boardUniversity.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Grade/Percentage/CGPA (e.g., 9.2 CGPA, 92%)"
                    {...register("gradePercentage")}
                  />
                  {errors.gradePercentage && (
                    <p className="text-sm text-red-500">{errors.gradePercentage.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Field of Study (e.g., Computer Science)"
                    {...register("fieldOfStudy")}
                  />
                  {errors.fieldOfStudy && (
                    <p className="text-sm text-red-500">{errors.fieldOfStudy.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Achievements/Awards (e.g., Valedictorian, Dean's List)"
                    {...register("achievements")}
                  />
                  {errors.achievements && (
                    <p className="text-sm text-red-500">{errors.achievements.message}</p>
                  )}
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  type="month"
                  {...register("startDate")}
                  error={errors.startDate}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  type="month"
                  {...register("endDate")}
                  disabled={current}
                  error={errors.endDate}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="current"
                {...register("current")}
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) {
                    setValue("endDate", "");
                  }
                }}
              />
              <label htmlFor="current">Current {type}</label>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder={`Description of your ${type.toLowerCase()}`}
                className="h-32"
                {...register("description")}
                error={errors.description}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleImproveDescription}
              disabled={isImproving || !watch("description")}
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Improve with AI
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add {type}
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
}