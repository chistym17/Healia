const notes = [
  {
    title: "Guidance, not a diagnosis",
    body: "Healia helps you sort the next step. It does not diagnose, prescribe, or take the place of a clinician.",
  },
  {
    title: "You can just talk",
    body: "Describe how you feel out loud. Healia asks one follow-up at a time.",
  },
  {
    title: "Only your account",
    body: "The written guidance is saved so you can open it later. It is not used for advertising.",
  },
  {
    title: "Everyday words are enough",
    body: "You do not need the medical name. Where it is, when it started, and what changes it is a good start.",
  },
];

export function FaqSection() {
  return (
    <section className="border-y border-healia-border-subtle bg-white">
      <div className="mx-auto max-w-page px-5 py-16 md:px-8 md:py-20 lg:px-12">
        <h2 className="text-3xl font-medium text-healia-text md:text-4xl">
          What a visit with Healia is
        </h2>

        <dl className="mt-10 divide-y divide-healia-border">
          {notes.map((note) => (
            <div
              key={note.title}
              className="grid gap-2 py-6 md:grid-cols-[16rem_1fr] md:items-baseline md:gap-12"
            >
              <dt className="font-serif text-xl text-healia-text">{note.title}</dt>
              <dd className="text-sm leading-relaxed text-healia-text-secondary">
                {note.body}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
