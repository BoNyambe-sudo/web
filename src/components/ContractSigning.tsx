import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  downloadPublicContractPdf,
  fetchPublicContract,
  signPublicContract,
  type PublicContract,
} from "@/lib/clientApi";

const ContractSigning = ({ token }: { token: string }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [contract, setContract] = React.useState<PublicContract | null>(null);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState(contract?.clientEmail || "");
  const [phone, setPhone] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [signed, setSigned] = React.useState(false);
  const [pending, setPending] = React.useState(true);
  const [error, setError] = React.useState("");
  const [drawing, setDrawing] = React.useState(false);

  const downloadPdf = async () => {
    try {
      const blob = await downloadPublicContractPdf(token);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "signed-contract.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("The signed contract PDF could not be downloaded.");
    }
  };

  React.useEffect(() => {
    fetchPublicContract(token)
      .then(setContract)
      .catch(() =>
        setError("This contract link is invalid, expired, or unavailable."),
      )
      .finally(() => setPending(false));
  }, [token]);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const bounds = canvas.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const position = point(event);
    if (!canvas || !position) return;
    canvas.setPointerCapture(event.pointerId);
    const context = canvas.getContext("2d");
    if (!context) return;
    context.beginPath();
    context.moveTo(position.x, position.y);
    setDrawing(true);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const position = point(event);
    const context = canvasRef.current?.getContext("2d");
    if (!position || !context) return;
    context.lineWidth = 2;
    context.lineCap = "round";
    context.strokeStyle = "#111827";
    context.lineTo(position.x, position.y);
    context.stroke();
  };

  const submit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    const signature = canvasRef.current?.toDataURL("image/png").split(",")[1];
    if (
      !name.trim() ||
      !consent ||
      !signature ||
      !email ||
      !phone ||
      !canvasRef.current
    ) {
      setError(
        "Enter your name, draw your signature, and accept the agreement.",
      );
      return;
    }
    setPending(true);
    setError("");
    try {
      await signPublicContract(token, {
        clientName: name.trim(),
        clientSignature: signature,
        consentVersion: new Date().toDateString(),
        clientPhone: phone,
        clientEmail: email,
      });
      setSigned(true);
    } catch {
      setError(
        "The contract could not be signed. It may already be signed or unavailable.",
      );
    } finally {
      setPending(false);
    }
  };

  if (pending && !contract)
    return <main className="container py-16">Loading contract...</main>;
  if (error && !contract)
    return (
      <main className="container py-16">
        <h1 className="text-2xl font-bold">Contract unavailable</h1>
        <p className="mt-3 text-muted-foreground">{error}</p>
      </main>
    );
  if (!contract) return null;

  return (
    <main className="container max-w-4xl space-y-8 py-10">
      <header className="space-y-2 border-b pb-6">
        <p className="text-sm uppercase tracking-[0.2em] text-primary">
          Web Development Agreement
        </p>
        <h1 className="text-3xl font-bold">
          Agreement for {contract.clientName || name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Effective {new Date(contract.effectiveDate).toLocaleDateString()}
        </p>
      </header>
      <article className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap">
        <h2>Scope of Work</h2>
        <p>{contract.deliverables}</p>
        {contract.exclusions && (
          <>
            <h2>Exclusions</h2>
            <p>{contract.exclusions}</p>
          </>
        )}
        <h2>Payment Terms</h2>
        <p>
          Total: {contract.currency} {contract.totalFee.toLocaleString()} |
          Deposit: {contract.currency} {contract.depositAmount.toLocaleString()}{" "}
          | Balance: {contract.currency}{" "}
          {contract.balanceAmount.toLocaleString()}
        </p>
        <p>{contract.paymentTerms}</p>
        <p>Payment methods: {contract.paymentMethods}</p>
        <h2>Client Obligations</h2>
        <p>{contract.clientObligations}</p>
        <h2>Intellectual Property</h2>
        <p>{contract.intellectualPropertyTerms}</p>
        <h2>Liability and Warranty</h2>
        <p>{contract.liabilityTerms}</p>
        <h2>Third-Party Platforms</h2>
        <p>{contract.thirdPartyTerms}</p>
        <h2>Governing Law and Disputes</h2>
        <p>{contract.disputeResolution + " " + contract.governingLaw}</p>
      </article>
      {signed || contract.status === "SIGNED" ? (
        <section className="space-y-4 border-t pt-6">
          <h2 className="text-xl font-semibold">Contract signed</h2>
          <p className="text-muted-foreground">
            Your signed contract has been recorded. You can download a copy or
            print it for your records.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={downloadPdf}>
              Download PDF
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.print()}
            >
              Print contract
            </Button>
          </div>
        </section>
      ) : (
        <form onSubmit={submit} className="space-y-5 border-t pt-6">
          <div className="space-y-2">
            <Label htmlFor="client-name">Full name</Label>
            <Input
              id="client-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-email">Email</Label>
            <Input
              id="client-email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-phone">Phone</Label>
            <Input
              id="client-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Draw your signature</Label>
            <canvas
              ref={canvasRef}
              width={800}
              height={180}
              className="h-40 w-full touch-none rounded-md border bg-white"
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={() => setDrawing(false)}
              onPointerLeave={() => setDrawing(false)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                canvasRef.current?.getContext("2d")?.clearRect(0, 0, 800, 180)
              }
            >
              Clear signature
            </Button>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span>I confirm that I have read and agree to this contract.</span>
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={pending}>
            {pending ? "Submitting..." : "Sign and submit contract"}
          </Button>
        </form>
      )}
    </main>
  );
};

export default ContractSigning;
