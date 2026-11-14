import { Check, ChevronLeft, Mic } from "lucide-react";
import { HealiaMark } from "./HealiaLogo";
import { V2Button } from "./V2Button";

const said = ["Since this morning", "Worse standing up"];
const note = ["Summary", "Next steps", "Warning signs"];

function HeroPhone() {
  return (
    <div className="relative w-[292px] sm:w-[330px]" aria-hidden="true">
      <div className="rounded-[2.8rem] bg-[#101418] p-[11px] shadow-[0_50px_90px_-28px_rgba(16,70,64,0.55)] ring-1 ring-black/30">
        <div className="relative h-[620px] overflow-hidden rounded-[2.25rem] bg-[radial-gradient(circle_at_50%_78%,#f4fffc_0%,#8edfd2_16%,#1a9a8c_44%,#0e7268_74%,#0a4e48_100%)]">
          <div className="absolute left-1/2 top-[7px] z-10 h-[22px] w-[92px] -translate-x-1/2 rounded-full bg-black" />

          <div className="flex items-center justify-between px-6 pt-3.5 text-[12px] font-semibold text-white">
            <span>9:41</span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 16 12" className="h-2.5 w-3.5" fill="currentColor">
                <rect x="0" y="7" width="2.2" height="5" rx="0.4" opacity="0.45" />
                <rect x="3.4" y="5" width="2.2" height="7" rx="0.4" opacity="0.7" />
                <rect x="6.8" y="2.5" width="2.2" height="9.5" rx="0.4" />
                <rect x="10.2" y="0" width="2.2" height="12" rx="0.4" />
              </svg>
              <svg viewBox="0 0 16 12" className="h-2.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M1 4.5c4-3.2 10-3.2 14 0" strokeLinecap="round" />
                <path d="M3.5 7c2.6-2 6.4-2 9 0" strokeLinecap="round" />
                <path d="M6.2 9.4c1.1-.8 2.5-.8 3.6 0" strokeLinecap="round" />
              </svg>
              <svg viewBox="0 0 22 12" className="h-2.5 w-5" fill="currentColor">
                <rect x="0.5" y="1" width="18" height="10" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
                <rect x="2" y="2.5" width="13" height="7" rx="1" />
                <rect x="19.2" y="4" width="1.6" height="4" rx="0.5" />
              </svg>
            </span>
          </div>

          <div className="mt-5 flex items-center justify-between px-4 text-white">
            <span className="flex h-8 w-8 items-center justify-center">
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="text-center">
              <span className="block text-[15px] font-semibold tracking-tight">Consultation</span>
              <span className="mt-0.5 flex items-center justify-center gap-1.5 text-[11px] font-medium text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Listening
              </span>
            </span>
            <span className="flex h-8 w-8 items-center justify-center">
              <Mic className="h-4 w-4" strokeWidth={1.75} />
            </span>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-2 px-4">
            {said.map((line) => (
              <span
                key={line}
                className="rounded-full bg-white px-3 py-[7px] text-[13px] font-medium text-[#1B2422] shadow-[0_8px_16px_-10px_rgba(8,40,36,0.7)]"
              >
                {line}
              </span>
            ))}
          </div>

          <div className="mt-2.5 flex justify-center px-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-[7px] text-[13px] font-medium text-[#0E5C56] shadow-[0_8px_16px_-10px_rgba(8,40,36,0.7)]">
              <HealiaMark className="h-3.5 w-3.5" />
              Any vision changes?
            </span>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2 px-4">
            {note.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/40 bg-white/15 px-3 py-1.5 text-[12px] font-medium text-white"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="absolute bottom-32 left-1/2 flex h-[92px] w-[92px] -translate-x-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_32%_28%,#ffffff_0%,#d8fff6_20%,#7dcec4_48%,#1a7a70_74%,#0c3f3a_100%)] text-white shadow-[0_18px_30px_-8px_rgba(6,40,36,0.5),inset_0_0_18px_rgba(255,255,255,0.5)]">
            <Mic className="h-7 w-7" strokeWidth={1.75} />
          </div>
        </div>
      </div>
    </div>
  );
}

const points = [
  "Evidence-based guidance",
  "Voice-first consultation",
  "Clear next steps",
];

export function HeroSection() {
  return (
    <section className="relative px-5 pb-16 pt-12 md:pt-16 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-8%] top-0 h-[780px] w-[min(860px,100%)] rounded-full bg-[radial-gradient(circle,rgba(198,236,230,0.95)_0%,rgba(214,236,255,0.5)_40%,rgba(247,248,246,0)_70%)]" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-center lg:gap-16">
        <div className="flex w-full min-w-0 max-w-xl flex-col items-center text-center lg:items-start lg:text-left">
          <p className="text-sm font-medium uppercase tracking-widest text-healia-brand">
            Health consultation assistant
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-healia-text sm:text-5xl">
            Understand your symptoms.
            <span className="mt-1 block">Know what to do next.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-healia-text-secondary md:text-[17px]">
            Healia helps you describe how you feel, asks the right questions,
            and gives you calm, evidence-based guidance you can actually use.
          </p>

          <ul className="mt-6 space-y-2.5 text-sm text-healia-text">
            {points.map((point) => (
              <li key={point} className="flex items-center justify-center gap-2.5 lg:justify-start">
                <Check className="h-4 w-4 shrink-0 text-healia-brand" strokeWidth={2.25} />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <V2Button to="/consultation">Start Consultation</V2Button>
            <V2Button to="/about" variant="secondary">
              Learn more
            </V2Button>
          </div>
        </div>

        <div className="shrink-0">
          <HeroPhone />
        </div>
      </div>
    </section>
  );
}
