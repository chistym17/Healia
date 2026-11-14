import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { HealiaLogo } from "@/v2/components/HealiaLogo";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="v2-root flex min-h-screen flex-col bg-healia-bg">
      <header className="border-b border-healia-border-subtle bg-healia-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-page items-center px-5 md:px-8 lg:px-12">
          <Link
            to="/"
            className="flex items-center gap-2 text-healia-text transition-opacity hover:opacity-80"
          >
            <HealiaLogo
              markClassName="h-7 w-7"
              wordClassName="font-serif text-lg font-semibold tracking-tight"
            />
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-10 md:px-8">
        <div className="grid w-full max-w-4xl gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          <section className="hidden flex-col justify-center lg:flex lg:pr-4">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-healia-brand">
              Your health, calmly guided
            </p>
            <h1 className="mt-4 max-w-lg text-4xl font-medium leading-[1.15] text-healia-text xl:text-[2.75rem]">
              Sign in to save consultations and revisit your guidance.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-healia-text-secondary">
              Healia helps you talk through symptoms and get evidence-based
              next steps. Your sessions stay private to your account.
            </p>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-[0_24px_60px_-36px_rgba(23,32,29,0.4)] ring-1 ring-healia-border/70 md:p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-medium text-healia-text">
                {title}
              </h2>
              <p className="mt-2 text-sm text-healia-text-secondary">{subtitle}</p>
            </div>
            {children}
            <div className="mt-6 border-t border-healia-border-subtle pt-4 text-sm text-healia-text-secondary">
              {footer}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
