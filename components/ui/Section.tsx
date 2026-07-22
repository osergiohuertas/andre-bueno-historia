import type { ElementType, ReactNode } from "react";

type Tone = "paper" | "paper-mid" | "ink";

const TONES: Record<Tone, string> = {
  paper: "bg-paper text-ink",
  "paper-mid": "bg-paper-mid text-ink",
  ink: "bg-ink text-paper",
};

export function Section({
  children,
  className = "",
  tone = "paper",
  as: As = "section",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  as?: ElementType;
  id?: string;
}) {
  return (
    <As id={id} className={`py-16 md:py-24 ${TONES[tone]} ${className}`}>
      {children}
    </As>
  );
}
