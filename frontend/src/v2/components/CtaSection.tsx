import { V2Button } from "./V2Button";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-16 text-center md:py-20">
      <h2 className="text-3xl font-medium text-healia-text md:text-5xl">
        Bring the symptom that is on your mind.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-healia-text-secondary">
        One voice visit, then a page you can reread. If it feels urgent, get
        emergency care first.
      </p>
      <div className="mt-8">
        <V2Button to="/consultation">Start consultation</V2Button>
      </div>
    </section>
  );
}
