"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTodayString } from "@/lib/utils";
import { z } from "zod";

const onboardingSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name"),
  childName: z.string().min(1, "Please enter your child's name"),
  childGrade: z.enum(["K", "1", "2", "3", "4", "5", "6", "7", "8"]),
  childSubjects: z.array(z.string()).min(1, "Please select at least one subject"),
  childInterests: z.string().min(1, "Please tell us about your child's interests"),
  childLearningNotes: z.string().optional(),
});

export async function completeOnboarding(data: {
  firstName: string;
  childName: string;
  childGrade: string;
  childSubjects: string[];
  childInterests: string;
  childLearningNotes?: string;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = onboardingSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Create profile
  const { error: profileError } = await supabase.from("profiles").insert({
    user_id: user.id,
    first_name: parsed.data.firstName,
    subscription_status: "free",
    worksheets_generated_this_month: 0,
    worksheet_monthly_limit: 10,
    month_reset_date: getTodayString(),
  });

  if (profileError) {
    return { error: "Failed to create profile. Please try again." };
  }

  // Create first child
  const { error: childError } = await supabase.from("children").insert({
    user_id: user.id,
    name: parsed.data.childName,
    grade: parsed.data.childGrade,
    subjects: parsed.data.childSubjects,
    interests: parsed.data.childInterests,
    learning_notes: parsed.data.childLearningNotes || null,
    active: true,
  });

  if (childError) {
    return { error: "Failed to create child profile. Please try again." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

const childSchema = z.object({
  name: z.string().min(1, "Please enter a name"),
  grade: z.enum(["K", "1", "2", "3", "4", "5", "6", "7", "8"]),
  subjects: z.array(z.string()).min(1, "Please select at least one subject"),
  interests: z.string().min(1, "Please enter some interests"),
  learning_notes: z.string().optional(),
});

export async function addChild(data: {
  name: string;
  grade: string;
  subjects: string[];
  interests: string;
  learning_notes?: string;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Check subscription for multiple children
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("user_id", user.id)
    .single();

  if (!profile) return { error: "Profile not found" };

  if (profile.subscription_status === "free") {
    const { count } = await supabase
      .from("children")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("active", true);

    if ((count || 0) >= 1) {
      return { error: "upgrade_required" };
    }
  }

  const parsed = childSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase.from("children").insert({
    user_id: user.id,
    name: parsed.data.name,
    grade: parsed.data.grade,
    subjects: parsed.data.subjects,
    interests: parsed.data.interests,
    learning_notes: parsed.data.learning_notes || null,
    active: true,
  });

  if (error) {
    return { error: "Failed to add child. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/children");
  return { success: true };
}

export async function updateChild(
  childId: string,
  data: {
    name: string;
    grade: string;
    subjects: string[];
    interests: string;
    learning_notes?: string;
  }
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = childSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("children")
    .update({
      name: parsed.data.name,
      grade: parsed.data.grade,
      subjects: parsed.data.subjects,
      interests: parsed.data.interests,
      learning_notes: parsed.data.learning_notes || null,
    })
    .eq("id", childId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Failed to update child. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/children");
  return { success: true };
}

export async function deleteChild(childId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("children")
    .update({ active: false })
    .eq("id", childId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Failed to remove child." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/children");
  return { success: true };
}
