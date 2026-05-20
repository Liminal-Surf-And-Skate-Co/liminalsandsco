import { useState } from "react";

export function Custom() {
  const [sent, setSent] = useState(false);
  return (
    <section id="custom" className="relative py-32 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6">
            (04) Commission
          </p>
          <h2 className="font-display font-black text-5xl lg:text-7xl leading-none mb-8">
            Build the<br />board only<br />you can ride.
          </h2>
          <p className="text-silver/80 text-lg leading-relaxed mb-8 max-w-md">
            Tell us about the shape, the graphic, the feeling. We'll quote
            within 48 hours and ship the finished piece in 2–4 weeks.
          </p>
          <ul className="space-y-3 font-mono text-sm text-silver/70">
            <li>✦ Skate decks · 7.5" – 10"</li>
            <li>✦ Surfboards · shortboard / fish / mid-length</li>
            <li>✦ Custom graphics & inlays</li>
          </ul>
        </div>
        <div className="bg-card/60 border border-border p-8 backdrop-blur-sm">
          {sent ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <p className="font-display text-3xl text-primary mb-3">✦ Got it.</p>
                <p className="text-silver/70 font-mono text-sm">
                  We'll be in touch within 48 hours.
                </p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-4"
            >
              <Field label="Name" name="name" />
              <Field label="Email" name="email" type="email" />
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-2">
                  Type
                </label>
                <select className="w-full bg-input/60 border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary">
                  <option>Skate deck</option>
                  <option>Surfboard</option>
                  <option>Apparel run</option>
                </select>
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-2">
                  Tell us the vision
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-input/60 border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-purple text-primary-foreground py-4 font-mono text-xs uppercase tracking-widest shadow-glow hover:translate-y-[-2px] transition-transform"
              >
                Request a Quote
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-silver/60 block mb-2">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required
        className="w-full bg-input/60 border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary"
      />
    </div>
  );
}
