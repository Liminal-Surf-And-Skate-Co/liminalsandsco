import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section id="newsletter" className="relative py-32 border-t border-border/40">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6">
          (03) Stay in the loop
        </p>
        <h2 className="font-display font-black text-5xl lg:text-7xl leading-none mb-6">
          Weekly dispatches<br />from the workshop.
        </h2>
        <p className="text-silver/80 text-lg max-w-xl mx-auto mb-10">
          New drops, build progress, surf reports, and the occasional misfit
          deck sale. One email a week. No fluff.
        </p>

        {sent ? (
          <p className="font-mono text-sm text-primary uppercase tracking-widest">
            ✦ You're in. See you Sunday.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setSent(true);
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-input/60 border border-border px-5 py-4 font-mono text-sm focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="bg-gradient-purple text-primary-foreground px-8 py-4 font-mono text-xs uppercase tracking-widest shadow-glow hover:translate-y-[-2px] transition-transform"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
