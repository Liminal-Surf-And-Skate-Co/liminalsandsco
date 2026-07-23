import { useState } from "react";
import { Ruler, ChevronRight, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Step = 0 | 1 | 2 | 3;
type RidingStyle = "street" | "bowl" | "surfskate" | "wave";

export function FitCalculator({
  productType,
}: {
  productType: "skateboard" | "surfboard" | "apparel";
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(0);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [style, setStyle] = useState<RidingStyle | null>(null);

  const reset = () => {
    setStep(0);
    setHeight("");
    setWeight("");
    setStyle(null);
    setOpen(false);
  };

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return height && Number(height) > 0;
    if (step === 2) return weight && Number(weight) > 0;
    if (step === 3) return style !== null;
    return false;
  };

  const result = (() => {
    if (step !== 3 || !style) return null;
    const h = Number(height) || 170;
    const w = Number(weight) || 70;

    if (productType === "skateboard") {
      let width = 8.0;
      if (h > 180) width = 8.25;
      if (h > 190) width = 8.5;
      if (style === "street") width = Math.max(7.75, width - 0.25);
      if (style === "bowl") width = Math.min(8.75, width + 0.25);
      const truck = width <= 8.0 ? "139mm" : width <= 8.25 ? "149mm" : "159mm";
      return { label: "Recommended Deck Width", value: `${width.toFixed(2)}"`, extra: `Truck: ${truck}` };
    }
    if (productType === "surfboard") {
      const volume = ((w * 0.4) + (h * 0.05) - (style === "wave" ? 2 : 0)).toFixed(1);
      return { label: "Recommended Volume", value: `${volume}L`, extra: `For ${style} style` };
    }
    return { label: "Recommended Size", value: h > 180 ? "L" : h > 170 ? "M" : "S", extra: `Based on ${h}cm height` };
  })();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5"
      >
        <Ruler className="h-4 w-4" /> Find My Size / Board Spec
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={reset}>
          <div
            className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">
                {step < 3 ? `Step ${step + 1} of 3` : "Your Recommendation"}
              </h3>
              <button onClick={reset} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="mb-6 flex gap-1.5">
              {[0, 1, 2].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    step > s || step === 3 ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {step === 0 && (
              <div className="space-y-3">
                <Label>What's your height? (cm)</Label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 175"
                  autoFocus
                />
              </div>
            )}
            {step === 1 && (
              <div className="space-y-3">
                <Label>What's your weight? (kg)</Label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 70"
                  autoFocus
                />
              </div>
            )}
            {step === 2 && (
              <div className="space-y-3">
                <Label>Riding style</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["street", "bowl", "surfskate", "wave"] as RidingStyle[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`rounded-md border px-4 py-3 text-sm capitalize transition ${
                        style === s
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {step === 3 && result && (
              <div className="space-y-4 text-center">
                <div className="rounded-lg border border-border bg-muted/30 p-6">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    {result.label}
                  </p>
                  <p className="text-3xl font-bold font-display text-primary">{result.value}</p>
                  <p className="text-sm text-muted-foreground mt-2">{result.extra}</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                  <Check className="h-4 w-4" /> Recommendation ready
                </div>
              </div>
            )}

            {step < 3 && (
              <div className="mt-6 flex justify-between">
                {step > 0 ? (
                  <Button variant="outline" onClick={() => setStep((s) => (s - 1) as Step)}>
                    Back
                  </Button>
                ) : (
                  <span />
                )}
                <Button
                  onClick={() => setStep((s) => (s + 1) as Step)}
                  disabled={!canProceed()}
                  className="gap-1.5"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            {step === 3 && (
              <div className="mt-6 flex justify-end">
                <Button onClick={reset}>Done</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
