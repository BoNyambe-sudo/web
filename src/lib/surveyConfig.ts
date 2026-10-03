export const SURVEY_STORAGE_KEY = "primal-survey-state";

export type SurveyResponseKey =
  | "has_website"
  | "business_goal"
  | "missing_revenue"
  | "industry"
  | "email"
  | "phone"
  | "budget"
  | "outcome";

export interface SurveyQuestion {
  key: SurveyResponseKey;
  title: string;
  description?: string;
  type: "choice" | "slider" | "email" | "phone" | "welcome" | "outcome";
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
}

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    key: "has_website",
    title: "Do you have a professional website?",
    description: "Start here — this helps us understand where you stand.",
    type: "welcome",
    options: ["Yes", "No", "Not sure"],
  },
  {
    key: "business_goal",
    title: "What's your PRIMARY business goal?",
    description: "Choose the outcome that matters most to you right now.",
    type: "choice",
    options: [
      "More customers",
      "Build credibility",
      "24/7 automated sales",
      "Expand into new markets",
    ],
  },
  {
    key: "missing_revenue",
    title: "How much revenue do you think you're missing without a website?",
    description: "Be honest — there's no wrong answer.",
    type: "slider",
    min: 0,
    max: 200000,
    unit: "ZMW",
  },
  {
    key: "industry",
    title: "What industry are you in?",
    description: "This helps us tailor recommendations to your market.",
    type: "choice",
    options: [
      "Technology",
      "Healthcare",
      "Finance",
      "Retail / E-commerce",
      "Professional Services",
      "Education",
      "Manufacturing",
      "Other",
    ],
  },
  {
    key: "email",
    title: "Your email for a personalized website audit (free)",
    description: "We'll send you actionable insights based on your answers.",
    type: "email",
  },
  {
    key: "phone",
    title: "Phone for priority consultation slot",
    description: "Limited slots available per week — first come, first served.",
    type: "phone",
  },
  {
    key: "budget",
    title: "Budget range for website investment?",
    description: "Helps us match you with the right solution.",
    type: "choice",
    options: [
      "Under K2,500",
      "K2,500 - K10,000",
      "K10,000 - K50,000",
      "K50,000+",
    ],
  },
  {
    key: "outcome",
    title: "Here's what we found",
    description: "Based on your answers, you're closer than you think.",
    type: "outcome",
  },
];

export const SURVEY_TOTAL_STEPS = SURVEY_QUESTIONS.length;

export function getSurveyOutcome(responses: Record<string, string | number>) {
  if (responses.has_website === "Yes") {
    return {
      urgency: "You already have a site — let's make it work harder for you.",
      cta: "Claim your free website audit and get a clear, actionable roadmap to dominate your market.",
      label: "Book Your Free Website Audit",
      dialogTitle: "Book Your Free Website Audit",
      submitLabel: "Confirm Booking",
      descriptionSuffix: "Schedule your website audit",
    };
  }

  if (
    responses.budget === "Under K2,500" &&
    responses.business_goal === "Build credibility"
  ) {
    return {
      urgency:
        "A strong online presence doesn't have to break the bank. We'll show you how to maximize ROI.",
      cta: "Limited consultation slots available this week only.",
      label: "Book a Call",
      dialogTitle: "Book a call now",
      submitLabel: "Confirm Booking",
      descriptionSuffix: "Schedule a call",
    };
  }

  return {
    urgency:
      "Without a website, you're invisible to 57% of buyers. This is your biggest growth opportunity.",
    cta: "Every day without a site is revenue left on the table. Let's fix that.",
    label: "Book a Call",
    dialogTitle: "Book a call now",
    submitLabel: "Confirm Booking",
    descriptionSuffix: "Schedule a call",
  };
}

export function buildSurveyDescription(
  responses: Record<string, string | number>,
  defaults: {
    email: string;
    phone: string;
    websiteUrl: string;
    revenue: number;
  },
) {
  const parts = [
    "=== SURVEY RESPONSES ===",
    `Has Website: ${responses.has_website || "Not answered"}`,
  ];
  if (responses.has_website === "Yes") {
    parts.push(
      `Website URL: ${responses.website_url || defaults.websiteUrl || "Not provided"}`,
    );
  }
  parts.push(
    `Primary Business Goal: ${responses.business_goal || "Not answered"}`,
  );
  parts.push(
    `Estimated Missing Revenue: ZMW ${(responses.missing_revenue ?? defaults.revenue).toLocaleString()}/month`,
  );
  parts.push(`Industry: ${responses.industry || "Not answered"}`);
  parts.push(`Budget Range: ${responses.budget || "Not answered"}`);
  parts.push(`Email: ${responses.email || defaults.email || "Not provided"}`);
  parts.push(`Phone: ${responses.phone || defaults.phone || "Not provided"}`);
  return parts.join("\n");
}
