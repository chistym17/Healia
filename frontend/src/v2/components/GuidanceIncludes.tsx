import { Reveal } from "./Reveal";

const parts = [
  {
    title: "Summary",
    body: "A plain-language read of what you described, and what it may suggest.",
  },
  {
    title: "What you can do now",
    body: "Practical steps for the next few hours, such as rest, fluids, or watching a symptom.",
  },
  {
    title: "Warning signs",
    body: "Symptoms that should not wait, set apart so they are easy to see.",
  },
  {
    title: "When to seek care",
    body: "A clear note on whether this can wait, or whether a clinician should see you.",
  },
];

export function GuidanceIncludes() {
  return (
    <section className="mx-auto max-w-page px-5 py-20 md:px-8 md:py-24 lg:px-12">
      <Reveal>
        <h2 className="max-w-xl text-4xl font-medium text-healia-text">
          What the guidance page includes
        </h2>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-healia-text-secondary">
          Not a chat log. A short health note you can come back to.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-healia-border sm:grid-cols-2">
        {parts.map((part, index) => (
          <Reveal key={part.title} delay={index * 70}>
            <article className="h-full bg-healia-bg p-6 md:p-8">
              <h3 className="text-2xl font-medium text-healia-text">{part.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-healia-text-secondary">
                {part.body}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
