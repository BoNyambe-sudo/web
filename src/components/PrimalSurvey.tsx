import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { SurveyQuestion } from "@/components/SurveyQuestion";
import { useSurveyStore } from "@/stores/surveyStore";
import AppointmentDialog from "@/components/AppointmentDialog";
import { X } from "lucide-react";

const TOTAL_STEPS = 8;
const STORAGE_KEY = "primal-survey-state";

type ResponseKey = "has_website" | "business_goal" | "missing_revenue" | "industry" | "email" | "phone" | "budget" | "outcome";

interface QuestionScreen {
  key: ResponseKey;
  title: string;
  description?: string;
  type: "choice" | "slider" | "email" | "phone" | "welcome" | "outcome";
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
}

const QUESTIONS: QuestionScreen[] = [
  { key: "has_website", title: "Do you have a professional website?", description: "Start here — this helps us understand where you stand.", type: "welcome", options: ["Yes", "No", "Not sure"] },
  { key: "business_goal", title: "What's your PRIMARY business goal?", description: "Choose the outcome that matters most to you right now.", type: "choice", options: ["More customers", "Build credibility", "24/7 automated sales", "Expand into new markets"] },
  { key: "missing_revenue", title: "How much revenue do you think you're missing without a website?", description: "Be honest — there's no wrong answer.", type: "slider", min: 0, max: 200000, unit: "ZMW" },
  { key: "industry", title: "What industry are you in?", description: "This helps us tailor recommendations to your market.", type: "choice", options: ["Technology", "Healthcare", "Finance", "Retail / E-commerce", "Professional Services", "Education", "Manufacturing", "Other"] },
  { key: "email", title: "Your email for a personalized website audit (free)", description: "We'll send you actionable insights based on your answers.", type: "email" },
  { key: "phone", title: "Phone for priority consultation slot", description: "Limited slots available per week — first come, first served.", type: "phone" },
  { key: "budget", title: "Budget range for website investment?", description: "Helps us match you with the right solution.", type: "choice", options: ["Under K2,500", "K2,500 - K10,000", "K10,000 - K50,000", "K50,000+"] },
  { key: "outcome", title: "Here's what we found", description: "Based on your answers, you're closer than you think.", type: "outcome" },
];

const getLocal = (name: string) => {
  try { return localStorage.getItem(name) || ""; } catch { return ""; }
};
const getStoredResponses = (): Record<string, string | number> => {
  try {
    const parsed = JSON.parse(getLocal(STORAGE_KEY));
    return parsed.responses || {};
  } catch { return {}; }
};

const PrimalSurvey = () => {
  const [direction, setDirection] = React.useState<"forward" | "backward">("forward");
  const [isAppointmentOpen, setIsAppointmentOpen] = React.useState(false);
  const currentStep = useSurveyStore((s) => s.currentStep);
  const responses = useSurveyStore((s) => s.responses);
  const setResponse = useSurveyStore((s) => s.setResponse);
  const nextStep = useSurveyStore((s) => s.nextStep);
  const prevStep = useSurveyStore((s) => s.prevStep);

  const [sliderValue, setSliderValue] = React.useState(() => {
    const r = getStoredResponses();
    return (typeof r.missing_revenue === "number" ? r.missing_revenue : 25000);
  });
  const [tempEmail, setTempEmail] = React.useState(() => {
    const r = getStoredResponses();
    return typeof r.email === "string" ? r.email : "";
  });
  const [tempPhone, setTempPhone] = React.useState(() => {
    const r = getStoredResponses();
    return typeof r.phone === "string" ? r.phone : "";
  });
  const [tempWebsiteUrl, setTempWebsiteUrl] = React.useState(() => {
    const r = getStoredResponses();
    return typeof r.website_url === "string" ? r.website_url : "";
  });
  const [showValidationError, setShowValidationError] = React.useState(false);

  const handleNext = () => {
    setShowValidationError(false);
    if (currentStep === 1 && !responses.business_goal) { setShowValidationError(true); return; }
    if (currentStep === 3 && !responses.industry) { setShowValidationError(true); return; }
    if (currentStep === 4 && !tempEmail) { setShowValidationError(true); return; }
    if (currentStep === 4 && responses.has_website === "Yes" && !tempWebsiteUrl) { setShowValidationError(true); return; }
    if (currentStep === 5 && !tempPhone) { setShowValidationError(true); return; }
    if (currentStep === 6 && !responses.budget) { setShowValidationError(true); return; }
    if (currentStep === TOTAL_STEPS - 1) { window.location.href = "/portfolio-dev/website-benefits/"; return; }
    setDirection("forward");
    nextStep();
  };

  const handleBack = () => {
    setDirection("backward");
    prevStep();
  };

  const handleAnswer = (key: ResponseKey, value: string | number) => setResponse(key, value);

  React.useEffect(() => {
    if (currentStep === 4 && tempEmail) setResponse("email", tempEmail);
    if (currentStep === 4 && tempWebsiteUrl) setResponse("website_url", tempWebsiteUrl);
    if (currentStep === 5 && tempPhone) setResponse("phone", tempPhone);
    if (currentStep === 2) setResponse("missing_revenue", sliderValue);
  }, [tempEmail, tempPhone, tempWebsiteUrl, sliderValue, currentStep, setResponse]);

  const question = QUESTIONS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TOTAL_STEPS - 1;
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const getOutcomeDetails = () => {
    const hasWebsite = responses.has_website === "Yes";
    const budget = responses.budget;
    if (hasWebsite) {
      return { urgency: "You already have a site — let's make it work harder for you.", cta: "Claim your free website audit and get a clear, actionable roadmap to dominate your market.", label: "Book Your Free Website Audit", dialogTitle: "Book Your Free Website Audit", submitLabel: "Confirm Booking", descriptionSuffix: "Schedule your website audit" };
    }
    let urgency = "Without a website, you're invisible to 57% of buyers. This is your biggest growth opportunity.";
    let cta = "Every day without a site is revenue left on the table. Let's fix that.";
    const label = "Book a Call";
    if (budget === "Under K2,500" && responses.business_goal === "Build credibility") {
      urgency = "A strong online presence doesn't have to break the bank. We'll show you how to maximize ROI.";
      cta = "Limited consultation slots available this week only.";
    }
    return { urgency, cta, label, dialogTitle: "Book a call now", submitLabel: "Confirm Booking", descriptionSuffix: "Schedule a call" };
  };

  const outcome = isLast && question.type === "outcome" ? getOutcomeDetails() : null;

  const buildSurveyDescription = () => {
    const email = responses.email || tempEmail || "Not provided";
    const phone = responses.phone || tempPhone || "Not provided";
    const parts: string[] = ["=== SURVEY RESPONSES ===", `Has Website: ${responses.has_website || "Not answered"}`];
    if (responses.has_website === "Yes") parts.push(`Website URL: ${responses.website_url || tempWebsiteUrl || "Not provided"}`);
    parts.push(`Primary Business Goal: ${responses.business_goal || "Not answered"}`);
    parts.push(`Estimated Missing Revenue: ZMW ${(responses.missing_revenue ?? sliderValue).toLocaleString()}/month`);
    parts.push(`Industry: ${responses.industry || "Not answered"}`);
    parts.push(`Budget Range: ${responses.budget || "Not answered"}`);
    parts.push(`Email: ${email}`, `Phone: ${phone}`);
    return parts.join("\n");
  };

  const surveyDescription = buildSurveyDescription();

  return (
    <div className="min-h-screen flex flex-col bg-background" id="main-content">
      <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{isFirst ? "Let's get started" : isLast ? "You're almost done" : "Keep going"}</span>
              <span className="text-xs font-medium text-primary tabular-nums">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} max={100} aria-label={`Question ${currentStep + 1} of ${TOTAL_STEPS}`} />
          </div>

          <div key={currentStep} className={`min-h-80 survey-anim ${direction === "forward" ? "from-right" : "from-left"}`} role="region" aria-live="polite" aria-atomic="true">
            {question.type === "welcome" && (
              <SurveyQuestion title={question.title} description={question.description} step={currentStep} totalSteps={TOTAL_STEPS}>
                <div className="space-y-3">
                  {question.options?.map((option) => (
                    <Button key={option} variant={responses.has_website === option ? "default" : "outline"} className="w-full justify-start text-sm h-11" onClick={() => handleAnswer("has_website", option)}>{option}</Button>
                  ))}
                </div>
              </SurveyQuestion>
            )}

            {question.type === "choice" && (
              <SurveyQuestion title={question.title} description={question.description} step={currentStep} totalSteps={TOTAL_STEPS}>
                <div className="space-y-3">
                  {question.options?.map((option) => {
                    const selected = currentStep === 1 ? responses.business_goal === option : currentStep === 3 ? responses.industry === option : responses.budget === option;
                    return (
                      <Button key={option} variant={selected ? "default" : "outline"} className="w-full justify-start text-sm h-11" onClick={() => { if (currentStep === 1) handleAnswer("business_goal", option); if (currentStep === 3) handleAnswer("industry", option); if (currentStep === 6) handleAnswer("budget", option); setShowValidationError(false); }}>{option}</Button>
                    );
                  })}
                  {showValidationError && <p className="text-xs text-destructive mt-2">Please select an option to continue.</p>}
                </div>
              </SurveyQuestion>
            )}

            {question.type === "slider" && (
              <SurveyQuestion title={question.title} description={question.description} step={currentStep} totalSteps={TOTAL_STEPS}>
                <div className="space-y-4 pt-2">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-primary tabular-nums">ZMW {sliderValue.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <input type="range" min={question.min ?? 0} max={question.max ?? 100000} value={sliderValue} onChange={(e) => setSliderValue(Number(e.target.value))} className="w-full accent-primary" aria-label="Missing revenue estimate" />
                  <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
                    <span>ZMW 0</span>
                    <span>ZMW {question.max?.toLocaleString()}</span>
                  </div>
                </div>
              </SurveyQuestion>
            )}

            {question.type === "email" && (
              <SurveyQuestion title={responses.has_website === "Yes" ? "Your email for a free website audit" : "Your email for a free consultation"} description={responses.has_website === "Yes" ? "We'll send you actionable insights to improve your existing website." : "We'll send you actionable insights based on your answers."} step={currentStep} totalSteps={TOTAL_STEPS}>
                <div className="space-y-2">
                  <Label htmlFor="survey-email">Email address</Label>
                  <Input id="survey-email" type="email" placeholder="you@example.com" value={tempEmail} onChange={(e) => { setTempEmail(e.target.value); if (e.target.value) setShowValidationError(false); }} autoFocus className="h-11" />
                  {showValidationError && !tempEmail && <p className="text-xs text-destructive">Please enter a valid email address.</p>}
                </div>
                {responses.has_website === "Yes" && (
                  <div className="space-y-2">
                    <Label htmlFor="survey-website">Website URL</Label>
                    <Input id="survey-website" type="url" placeholder="https://yourwebsite.com" value={tempWebsiteUrl} onChange={(e) => { setTempWebsiteUrl(e.target.value); if (e.target.value) setShowValidationError(false); }} className="h-11" />
                    {showValidationError && !tempWebsiteUrl && <p className="text-xs text-destructive">Please enter your website URL so we can conduct the audit.</p>}
                  </div>
                )}
              </SurveyQuestion>
            )}

            {question.type === "phone" && (
              <SurveyQuestion title={question.title} description={question.description} step={currentStep} totalSteps={TOTAL_STEPS}>
                <div className="space-y-2">
                  <Label htmlFor="survey-phone">Phone number</Label>
                  <Input id="survey-phone" type="tel" placeholder="+1 (555) 000-0000" value={tempPhone} onChange={(e) => { setTempPhone(e.target.value); if (e.target.value) setShowValidationError(false); }} autoFocus className="h-11" />
                  {showValidationError && <p className="text-xs text-destructive">Please enter a valid phone number.</p>}
                </div>
              </SurveyQuestion>
            )}

            {question.type === "outcome" && (
              <SurveyQuestion title={question.title} description={outcome?.urgency} step={currentStep} totalSteps={TOTAL_STEPS}>
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                    <p className="text-sm text-foreground font-medium">{outcome?.cta}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">We'll use <span className="font-medium">{responses.email || tempEmail}</span> to follow up.</p>
                    {responses.has_website === "Yes" && (
                      <p className="text-xs text-muted-foreground">Consultation slot: <span className="font-medium">{responses.phone || tempPhone}</span></p>
                    )}
                  </div>
                  <Button size="lg" className="w-full h-12 text-base font-semibold" onClick={() => setIsAppointmentOpen(true)}>{outcome!.label}</Button>
                  <AppointmentDialog open={isAppointmentOpen} onOpenChange={setIsAppointmentOpen} defaultEmail={tempEmail} defaultPhone={tempPhone} defaultDescription={surveyDescription} title={outcome!.dialogTitle} submitLabel={outcome!.submitLabel} descriptionPrefix={outcome!.descriptionSuffix} />
                </div>
              </SurveyQuestion>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            {!isFirst ? (
              <Button variant="ghost" size="default" onClick={handleBack} className="h-11 px-4">Back</Button>
            ) : <div />}
            {!isLast && (
              <Button size="default" onClick={handleNext} className="h-11 px-6">{currentStep === 0 ? "Start" : "Continue"}</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimalSurvey;
