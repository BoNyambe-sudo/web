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

const serializeSignature = (canvas: HTMLCanvasElement): string => {
  return canvas.toDataURL("image/png");
};

const packageOptions = [
  {
    value: "BASIC",
    label: "Basic Website",
    description:
      "Standard informational setup, essential pages, and responsive layout.",
  },
  {
    value: "STANDARD",
    label: "Standard Website",
    description:
      "Enhanced custom design, additional features, and tailored functionality.",
  },
  {
    value: "ECOMMERCE",
    label: "E-commerce Website",
    description:
      "Online store integration, product catalogs, and payment gateway setup.",
  },
];

const formatContractMoney = (currency: string, amount: number) =>
  `${currency} ${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const ContractSigning = ({ token }: { token: string }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const contractToken = React.useMemo(() => {
    const fromProp = token?.trim() ?? "";
    if (fromProp) return fromProp;

    if (typeof window === "undefined") return "";
    return (
      new URLSearchParams(window.location.search).get("token")?.trim() ?? ""
    );
  }, [token]);
  const [contract, setContract] = React.useState<PublicContract | null>(null);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState(contract?.clientEmail || "");
  const [address, setAddress] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [signed, setSigned] = React.useState(false);
  const [pending, setPending] = React.useState(true);
  const [error, setError] = React.useState("");
  const [drawing, setDrawing] = React.useState(false);

  const downloadPdf = async () => {
    if (!contractToken) {
      setError("This contract link is missing its token.");
      return;
    }

    try {
      const blob = await downloadPublicContractPdf(contractToken);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "contract.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("The signed contract PDF could not be downloaded.");
    }
  };

  React.useEffect(() => {
    if (!contractToken) {
      setError("This contract link is missing its token.");
      setPending(false);
      return;
    }

    fetchPublicContract(contractToken)
      .then(setContract)
      .catch(() =>
        setError("This contract link is invalid, expired, or unavailable."),
      )
      .finally(() => setPending(false));
  }, [contractToken]);

  React.useEffect(() => {
    if (!contract) return;
    setName(contract.clientName || "");
    setEmail(contract.clientEmail || "");
    setAddress(contract.clientAddress || "");
    setPhone(contract.clientPhone || "");
  }, [contract]);

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const bounds = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - bounds.left) / bounds.width) * canvas.width,
      y: ((event.clientY - bounds.top) / bounds.height) * canvas.height,
    };
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const position = getPoint(event);
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
    const position = getPoint(event);
    const context = canvasRef.current?.getContext("2d");
    if (!position || !context) return;
    context.lineTo(position.x, position.y);
    context.stroke();
  };

  const finishDrawing = () => {
    if (!drawing || !canvasRef.current) return;
    setDrawing(false);
  };

  const submit = async (event: React.SubmitEvent) => {
    event.preventDefault();
    const signature = canvasRef.current
      ? serializeSignature(canvasRef.current).split(",")[1]
      : undefined;
    if (
      !name.trim() ||
      !consent ||
      !signature ||
      !email ||
      !phone ||
      !address.trim() ||
      !canvasRef.current
    ) {
      setError(
        "Enter your name, email, phone, and address, draw your signature, and accept the agreement.",
      );
      return;
    }
    if (!contractToken) {
      setError("This contract link is missing its token.");
      return;
    }

    setPending(true);
    setError("");

    try {
      await signPublicContract(contractToken, {
        clientName: name.trim(),
        clientSignature: signature,
        consentVersion: new Date().toDateString(),
        clientPhone: phone,
        clientEmail: email,
        clientAddress: address,
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

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return;
    context.lineWidth = 3.5;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#111827";
  }, [contract]);

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
      <article className="overflow-hidden border border-border bg-card text-foreground shadow-sm">
        <header className="border-b-2 border-foreground/80 px-6 py-8 text-center sm:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Contract for Services
          </p>
          <h1 className="mt-3 text-2xl font-bold uppercase sm:text-3xl">
            Web Development Agreement
          </h1>
          <p className="mt-4 text-sm leading-6 text-foreground/80">
            This Agreement is entered into on{" "}
            <strong>
              {new Date(contract.effectiveDate).toLocaleDateString()}
            </strong>{" "}
            between Frank Nyambe ("Developer") and the Client identified below.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-2 border-y border-border py-3 text-sm">
            <p>
              <span className="font-semibold">Effective date:</span>{" "}
              {new Date(contract.effectiveDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {contract.status}
            </p>
          </div>
        </header>

        <div className="space-y-8 px-6 py-8 sm:px-12 sm:py-10">
          <section>
            <h2 className="border-b border-border pb-2 text-sm font-bold uppercase">
              1. The Parties &amp; Effective Date
            </h2>
            <p className="mt-4 text-sm leading-6 text-foreground/80">
              This Agreement is entered into on{" "}
              <span className="font-semibold">
                {new Date(contract.effectiveDate).toLocaleDateString()}
              </span>{" "}
              between <span className="font-semibold">Bo Nyambe</span>{" "}
              ("Developer"), email: {contract.developerEmail}, and{" "}
              <span className="font-semibold">
                {name ||
                  contract.clientName ||
                  "______________________________"}
              </span>{" "}
              ("Client"), email:{" "}
              {email ||
                contract.clientEmail ||
                "______________________________"}
              .
            </p>
            <dl className="mt-4 grid gap-x-8 gap-y-5 text-sm sm:grid-cols-2">
              <div className="rounded-md border border-border bg-muted/40 p-4">
                <dt className="font-bold uppercase tracking-wide text-muted-foreground">
                  Developer
                </dt>
                <dd className="mt-2 leading-6 text-foreground">
                  {contract.developerName}
                  <br />
                  {contract.developerEmail}
                </dd>
              </div>
              <div className="rounded-md border border-border bg-muted/40 p-4">
                <dt className="font-bold uppercase tracking-wide text-muted-foreground">
                  Client
                </dt>
                <dd className="mt-2 leading-6 text-foreground">
                  {name || contract.clientName || "Client name to be provided"}
                  <br />
                  {email ||
                    contract.clientEmail ||
                    "Client email to be provided"}
                  <br />
                  {phone ||
                    contract.clientPhone ||
                    "Client phone to be provided"}
                  <br />
                  {address ||
                    contract.clientAddress ||
                    "Client address to be provided"}
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="border-b border-border pb-2 text-sm font-bold uppercase">
              2. Scope of Work &amp; Selection
            </h2>
            <p className="mt-4 text-sm leading-6 text-foreground/80">
              The Developer agrees to deliver the web development package
              selected below (Check one):
            </p>
            <div className="mt-4 space-y-2">
              {packageOptions.map((option) => {
                const selected = contract.package === option.value;
                return (
                  <div
                    key={option.value}
                    className={`flex gap-3 border p-3 text-sm ${selected ? "border-foreground bg-muted" : "border-border"}`}
                  >
                    <span
                      className="mt-0.5 flex size-4 shrink-0 items-center justify-center border border-foreground text-[10px] font-bold"
                      aria-label={
                        selected ? "Selected package" : "Not selected"
                      }
                    >
                      {selected ? "X" : ""}
                    </span>
                    <div>
                      <p className="font-bold">
                        {option.label}
                        {selected ? " (Selected)" : ""}
                      </p>
                      <p className="mt-1 leading-5 text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 space-y-4 text-sm leading-6">
              <div>
                <h3 className="font-bold">
                  Specific Project Deliverables / Exclusions
                </h3>
                <p className="mt-1 whitespace-pre-wrap text-foreground/90">
                  {contract.deliverables}
                </p>
              </div>
              <div>
                <h3 className="font-bold">Exclusions</h3>
                <p className="mt-1 whitespace-pre-wrap text-foreground/90">
                  {contract.exclusions || "None specified."}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="border-b border-border pb-2 text-sm font-bold uppercase">
              3. Payment Terms
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 pr-4 font-bold">Payment</th>
                    <th className="py-2 pr-4 font-bold">Amount</th>
                    <th className="py-2 font-bold">Due</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/80">
                    <td className="py-3 pr-4">Total Project Fee</td>
                    <td className="py-3 pr-4 font-semibold">
                      {formatContractMoney(
                        contract.currency,
                        contract.totalFee,
                      )}
                    </td>
                    <td className="py-3">As agreed</td>
                  </tr>
                  <tr className="border-b border-border/80">
                    <td className="py-3 pr-4">Deposit (50% Upfront)</td>
                    <td className="py-3 pr-4 font-semibold">
                      {formatContractMoney(
                        contract.currency,
                        contract.depositAmount,
                      )}
                    </td>
                    <td className="py-3">Before work commences</td>
                  </tr>
                  <tr className="border-b border-border/80">
                    <td className="py-3 pr-4">Remaining Balance (50%)</td>
                    <td className="py-3 pr-4 font-semibold">
                      {formatContractMoney(
                        contract.currency,
                        contract.balanceAmount,
                      )}
                    </td>
                    <td className="py-3">
                      Upon completion or milestone approval
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-2 text-sm leading-6 text-foreground/90">
              <p>{contract.paymentTerms}</p>
              <p>
                <strong>Payment Methods:</strong> {contract.paymentMethods}.
                Late payments may suspend work.
              </p>
            </div>
          </section>

          <section>
            <h2 className="border-b border-border pb-2 text-sm font-bold uppercase">
              4. Client Obligations &amp; Content
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-foreground/90">
              {contract.clientObligations}
            </p>
          </section>

          <section>
            <h2 className="border-b border-border pb-2 text-sm font-bold uppercase">
              5. Intellectual Property Rights
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-foreground/90">
              {contract.intellectualPropertyTerms}
            </p>
          </section>

          <section>
            <h2 className="border-b border-border pb-2 text-sm font-bold uppercase">
              6. Limitation of Liability &amp; Warranty
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-foreground/90">
              {contract.liabilityTerms}
            </p>
          </section>

          <section>
            <h2 className="border-b border-border pb-2 text-sm font-bold uppercase">
              7. Third-Party Platforms
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-foreground/90">
              {contract.thirdPartyTerms}
            </p>
          </section>

          <section>
            <h2 className="border-b border-border pb-2 text-sm font-bold uppercase">
              8. Governing Law &amp; Dispute Resolution
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-foreground/90">
              {contract.disputeResolution} Governing law:{" "}
              {contract.governingLaw}.
            </p>
          </section>

          <section className="border-t-2 border-foreground/80 pt-6">
            <h2 className="text-sm font-bold uppercase">In Witness Whereof</h2>
            <p className="mt-2 text-sm leading-6 text-foreground/90">
              The parties execute this Agreement as of the date written above.
            </p>
          </section>
        </div>
      </article>
      {signed || contract.status === "SIGNED" ? (
        <section className="space-y-4 border-t pt-6">
          <h2 className="text-xl font-semibold">Contract signed</h2>
          <p className="text-muted-foreground">
            Your signed contract has been recorded. You can download a copy for
            your records.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={downloadPdf}>
              Download PDF
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
            <Label htmlFor="client-address">Full Address</Label>
            <Input
              id="client-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Draw your signature</Label>
            <canvas
              ref={canvasRef}
              width={720}
              height={180}
              className="h-40 w-full touch-none rounded-md border bg-white"
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={finishDrawing}
              onPointerLeave={finishDrawing}
              onPointerCancel={finishDrawing}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const context = canvas.getContext("2d");
                if (!context) return;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath();
              }}
            >
              Clear signature
            </Button>
          </div>
          <label className="flex gap-2 text-sm items-center">
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
