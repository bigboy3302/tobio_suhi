"use client";

import { useState } from "react";
import type { NhostClient } from "@nhost/nhost-js";
import type { Session } from "@nhost/nhost-js/auth";
import { Lock } from "lucide-react";

export default function SignInForm({
  nhost,
  onSignedIn,
}: {
  nhost: NhostClient;
  onSignedIn: (session: Session) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await nhost.auth.signInEmailPassword({ email, password });
      if (res.body.session) {
        onSignedIn(res.body.session);
      } else {
        setError("Pieteikšanās neizdevās — pārbaudi e-pastu un paroli.");
      }
    } catch {
      setError("Pieteikšanās neizdevās — pārbaudi e-pastu un paroli.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-ink/10 bg-cream-soft p-8"
      >
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-cream">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <p className="font-display text-lg font-bold text-ink">Tobio admin</p>
            <p className="text-xs text-ink-soft">Tikai pieteikšanās, bez publiskas reģistrācijas</p>
          </div>
        </div>

        <label className="mb-3 block text-sm">
          <span className="mb-1 block font-medium text-ink">E-pasts</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-ink/15 bg-cream px-3 py-2.5 text-sm outline-none focus:border-coral"
          />
        </label>

        <label className="mb-4 block text-sm">
          <span className="mb-1 block font-medium text-ink">Parole</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-ink/15 bg-cream px-3 py-2.5 text-sm outline-none focus:border-coral"
          />
        </label>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-ink py-2.5 text-sm font-semibold text-cream disabled:opacity-60"
        >
          {loading ? "Pieteicas..." : "Pieteikties"}
        </button>
      </form>
    </div>
  );
}
