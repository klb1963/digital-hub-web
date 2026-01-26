// src/app/ai-labs/Card.tsx
import React from "react";

export function Card(props: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  accentColor?: string; // default: green
  children?: React.ReactNode;
}) {
  const { title, subtitle, children, accentColor = "#06BE81" } = props;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      {/* left accent bar */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ backgroundColor: accentColor }}
      />

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="text-base font-semibold leading-normal text-slate-900 md:text-lg">
            {title}
          </div>

          {subtitle ? (
            <div className="text-sm leading-relaxed text-slate-600 md:text-base">
              {subtitle}
            </div>
          ) : null}
        </div>

        {children ? <div className="pt-1">{children}</div> : null}
      </div>
    </section>
  );
}