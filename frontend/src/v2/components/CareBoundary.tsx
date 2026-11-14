const fit = [
  "You feel unwell and want a calm sense of what to do next.",
  "You can say when it started and what makes it better or worse.",
  "You want the written result saved so you can read it later.",
];

const urgent = [
  "Trouble breathing, chest pain, or fainting.",
  "A sudden severe headache, confusion, or weakness on one side.",
  "Heavy bleeding, a serious injury, or a symptom getting worse fast.",
];

export function CareBoundary() {
  return (
    <section className="mx-auto max-w-page px-5 py-16 md:px-8 md:py-20 lg:px-12">
      <h2 className="max-w-lg text-3xl font-medium text-healia-text md:text-4xl">
        Is this the right moment?
      </h2>

      <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-0">
        <div className="md:pr-12">
          <p className="text-sm font-medium text-healia-brand">Use Healia</p>
          <ol className="mt-6 space-y-5">
            {fit.map((item, index) => (
              <li key={item} className="flex gap-4">
                <span className="font-serif text-lg text-healia-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="pt-0.5 text-sm leading-relaxed text-healia-text-secondary">
                  {item}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-healia-border pt-10 md:border-l md:border-t-0 md:pl-12 md:pt-0">
          <p className="text-sm font-medium text-healia-danger">Get care now</p>
          <ul className="mt-6 space-y-4">
            {urgent.map((item) => (
              <li
                key={item}
                className="border-l-2 border-healia-danger/40 pl-4 text-sm leading-relaxed text-healia-text-secondary"
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm font-medium text-healia-text">
            Call your local emergency number. Do not wait for a consultation.
          </p>
        </div>
      </div>
    </section>
  );
}
