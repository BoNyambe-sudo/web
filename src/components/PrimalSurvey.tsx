import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { SurveyQuestion } from "@/components/SurveyQuestion";
import { useSurveyStore } from "@/stores/surveyStore";
import AppointmentDialog from "@/components/AppointmentDialog";
import {
  buildSurveyDescription,
  getSurveyOutcome,
  SURVEY_QUESTIONS,
  SURVEY_STORAGE_KEY,
  SURVEY_TOTAL_STEPS,
  type SurveyResponseKey,
} from "@/lib/surveyConfig";

const getLocal = (name: string) => {
  try {
    return localStorage.getItem(name) || "";
  } catch {
    return "";
  }
};
const getStoredResponses = (): Record<string, string | number> => {
  try {
    const parsed = JSON.parse(getLocal(SURVEY_STORAGE_KEY));
    return parsed.responses || {};
  } catch {
    return {};
  }
};

interface PrimalSurveyProps {
  inline?: boolean;
}

const PrimalSurvey = ({ inline = false }: PrimalSurveyProps) => {
  const [direction, setDirection] = React.useState<"forward" | "backward">(
    "forward",
  );
  const [isAppointmentOpen, setIsAppointmentOpen] = React.useState(false);
  const currentStep = useSurveyStore((s) => s.currentStep);
  const responses = useSurveyStore((s) => s.responses);
  const setResponse = useSurveyStore((s) => s.setResponse);
  const nextStep = useSurveyStore((s) => s.nextStep);
  const prevStep = useSurveyStore((s) => s.prevStep);

  const [sliderValue, setSliderValue] = React.useState(() => {
    const r = getStoredResponses();
    return typeof r.missing_revenue === "number" ? r.missing_revenue : 25000;
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
    if (currentStep === 1 && !responses.business_goal) {
      setShowValidationError(true);
      return;
    }
    if (currentStep === 3 && !responses.industry) {
      setShowValidationError(true);
      return;
    }
    if (currentStep === 4 && !tempEmail) {
      setShowValidationError(true);
      return;
    }
    if (
      currentStep === 4 &&
      responses.has_website === "Yes" &&
      !tempWebsiteUrl
    ) {
      setShowValidationError(true);
      return;
    }
    if (currentStep === 5 && !tempPhone) {
      setShowValidationError(true);
      return;
    }
    if (currentStep === 6 && !responses.budget) {
      setShowValidationError(true);
      return;
    }
    if (currentStep === SURVEY_TOTAL_STEPS - 1) {
      window.location.href = "/web/website-benefits/";
      return;
    }
    setDirection("forward");
    nextStep();
  };

  const handleBack = () => {
    setDirection("backward");
    prevStep();
  };

  const handleAnswer = (key: SurveyResponseKey, value: string | number) =>
    setResponse(key, value);

  React.useEffect(() => {
    if (currentStep === 4 && tempEmail) setResponse("email", tempEmail);
    if (currentStep === 4 && tempWebsiteUrl)
      setResponse("website_url", tempWebsiteUrl);
    if (currentStep === 5 && tempPhone) setResponse("phone", tempPhone);
    if (currentStep === 2) setResponse("missing_revenue", sliderValue);
  }, [
    tempEmail,
    tempPhone,
    tempWebsiteUrl,
    sliderValue,
    currentStep,
    setResponse,
  ]);

  const question = SURVEY_QUESTIONS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === SURVEY_TOTAL_STEPS - 1;
  const progress = ((currentStep + 1) / SURVEY_TOTAL_STEPS) * 100;
  const outcome =
    isLast && question.type === "outcome" ? getSurveyOutcome(responses) : null;
  const surveyDescription = buildSurveyDescription(responses, {
    email: tempEmail,
    phone: tempPhone,
    websiteUrl: tempWebsiteUrl,
    revenue: sliderValue,
  });

  return (
    <div
      className={inline ? "w-full" : "min-h-screen flex flex-col bg-background"}
      id={inline ? undefined : "main-content"}
    >
      {!inline && (
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to main content
        </a>
      )}
      <div
        className={
          inline
            ? "w-full"
            : "flex-1 flex items-center justify-center px-4 py-8 sm:py-12"
        }
      >
        <div
          className={`w-full ${inline ? "max-w-2xl mx-auto" : "max-w-xl"} space-y-6`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {isFirst
                  ? "Let's get started"
                  : isLast
                    ? "You're almost done"
                    : "Keep going"}
              </span>
              <span className="text-xs font-medium text-primary tabular-nums">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress
              value={progress}
              max={100}
              aria-label={`Question ${currentStep + 1} of ${SURVEY_TOTAL_STEPS}`}
            />
          </div>

          <div
            key={currentStep}
            className={`min-h-80 survey-anim ${direction === "forward" ? "from-right" : "from-left"}`}
            role="region"
            aria-live="polite"
            aria-atomic="true"
          >
            {question.type === "welcome" && (
              <SurveyQuestion
                title={question.title}
                description={question.description}
                step={currentStep}
                totalSteps={SURVEY_TOTAL_STEPS}
                className={
                  inline ? "border-0 bg-transparent shadow-none" : undefined
                }
              >
                <div className="space-y-3">
                  {question.options?.map((option) => (
                    <Button
                      key={option}
                      variant={
                        responses.has_website === option ? "default" : "outline"
                      }
                      className="w-full justify-start text-sm h-11"
                      onClick={() => handleAnswer("has_website", option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </SurveyQuestion>
            )}

            {question.type === "choice" && (
              <SurveyQuestion
                title={question.title}
                description={question.description}
                step={currentStep}
                totalSteps={SURVEY_TOTAL_STEPS}
                className={
                  inline ? "border-0 bg-transparent shadow-none" : undefined
                }
              >
                <div className="space-y-3">
                  {question.options?.map((option) => {
                    const selected =
                      currentStep === 1
                        ? responses.business_goal === option
                        : currentStep === 3
                          ? responses.industry === option
                          : responses.budget === option;
                    return (
                      <Button
                        key={option}
                        variant={selected ? "default" : "outline"}
                        className="w-full justify-start text-sm h-11"
                        onClick={() => {
                          if (currentStep === 1)
                            handleAnswer("business_goal", option);
                          if (currentStep === 3)
                            handleAnswer("industry", option);
                          if (currentStep === 6) handleAnswer("budget", option);
                          setShowValidationError(false);
                        }}
                      >
                        {option}
                      </Button>
                    );
                  })}
                  {showValidationError && (
                    <p className="text-xs text-destructive mt-2">
                      Please select an option to continue.
                    </p>
                  )}
                </div>
              </SurveyQuestion>
            )}

            {question.type === "slider" && (
              <SurveyQuestion
                title={question.title}
                description={question.description}
                step={currentStep}
                totalSteps={SURVEY_TOTAL_STEPS}
                className={
                  inline ? "border-0 bg-transparent shadow-none" : undefined
                }
              >
                <div className="space-y-4 pt-2">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-primary tabular-nums">
                      ZMW {sliderValue.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <input
                    type="range"
                    min={question.min ?? 0}
                    max={question.max ?? 100000}
                    value={sliderValue}
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                    className="w-full accent-primary"
                    aria-label="Missing revenue estimate"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
                    <span>ZMW 0</span>
                    <span>ZMW {question.max?.toLocaleString()}</span>
                  </div>
                </div>
              </SurveyQuestion>
            )}

            {question.type === "email" && (
              <SurveyQuestion
                title={
                  responses.has_website === "Yes"
                    ? "Your email for a free website audit"
                    : "Your email for a free consultation"
                }
                description={
                  responses.has_website === "Yes"
                    ? "We'll send you actionable insights to improve your existing website."
                    : "We'll send you actionable insights based on your answers."
                }
                step={currentStep}
                totalSteps={SURVEY_TOTAL_STEPS}
                className={
                  inline ? "border-0 bg-transparent shadow-none" : undefined
                }
              >
                <div className="space-y-2">
                  <Label htmlFor="survey-email">Email address</Label>
                  <Input
                    id="survey-email"
                    type="email"
                    placeholder="you@example.com"
                    value={tempEmail}
                    onChange={(e) => {
                      setTempEmail(e.target.value);
                      if (e.target.value) setShowValidationError(false);
                    }}
                    autoFocus
                    className="h-11"
                  />
                  {showValidationError && !tempEmail && (
                    <p className="text-xs text-destructive">
                      Please enter a valid email address.
                    </p>
                  )}
                </div>
                {responses.has_website === "Yes" && (
                  <div className="space-y-2">
                    <Label htmlFor="survey-website">Website URL</Label>
                    <Input
                      id="survey-website"
                      type="url"
                      placeholder="https://yourwebsite.com"
                      value={tempWebsiteUrl}
                      onChange={(e) => {
                        setTempWebsiteUrl(e.target.value);
                        if (e.target.value) setShowValidationError(false);
                      }}
                      className="h-11"
                    />
                    {showValidationError && !tempWebsiteUrl && (
                      <p className="text-xs text-destructive">
                        Please enter your website URL so we can conduct the
                        audit.
                      </p>
                    )}
                  </div>
                )}
              </SurveyQuestion>
            )}

            {question.type === "phone" && (
              <SurveyQuestion
                title={question.title}
                description={question.description}
                step={currentStep}
                totalSteps={SURVEY_TOTAL_STEPS}
                className={
                  inline ? "border-0 bg-transparent shadow-none" : undefined
                }
              >
                <div className="space-y-2">
                  <Label htmlFor="survey-phone">Phone number</Label>
                  <Input
                    id="survey-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={tempPhone}
                    onChange={(e) => {
                      setTempPhone(e.target.value);
                      if (e.target.value) setShowValidationError(false);
                    }}
                    autoFocus
                    className="h-11"
                  />
                  {showValidationError && (
                    <p className="text-xs text-destructive">
                      Please enter a valid phone number.
                    </p>
                  )}
                </div>
              </SurveyQuestion>
            )}

            {question.type === "outcome" && (
              <SurveyQuestion
                title={question.title}
                description={outcome?.urgency}
                step={currentStep}
                totalSteps={SURVEY_TOTAL_STEPS}
                className={
                  inline ? "border-0 bg-transparent shadow-none" : undefined
                }
              >
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                    <p className="text-sm text-foreground font-medium">
                      {outcome?.cta}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      We'll use{" "}
                      <span className="font-medium">
                        {responses.email || tempEmail}
                      </span>{" "}
                      to follow up.
                    </p>
                    {responses.has_website === "Yes" && (
                      <p className="text-xs text-muted-foreground">
                        Consultation slot:{" "}
                        <span className="font-medium">
                          {responses.phone || tempPhone}
                        </span>
                      </p>
                    )}
                  </div>
                  <Button
                    size="lg"
                    className="w-full h-12 text-base font-semibold"
                    onClick={() => setIsAppointmentOpen(true)}
                  >
                    {outcome!.label}
                  </Button>
                  <AppointmentDialog
                    open={isAppointmentOpen}
                    onOpenChange={setIsAppointmentOpen}
                    defaultEmail={tempEmail}
                    defaultPhone={tempPhone}
                    defaultDescription={surveyDescription}
                    title={outcome!.dialogTitle}
                    submitLabel={outcome!.submitLabel}
                    descriptionPrefix={outcome!.descriptionSuffix}
                  />
                </div>
              </SurveyQuestion>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            {!isFirst ? (
              <Button
                variant="ghost"
                size="default"
                onClick={handleBack}
                className="h-11 px-4"
              >
                Back
              </Button>
            ) : (
              <div />
            )}
            {!isLast && (
              <Button size="default" onClick={handleNext} className="h-11 px-6">
                {currentStep === 0 ? "Start" : "Continue"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimalSurvey;
