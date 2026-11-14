import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { HealiaLogo } from "@/v2/components/HealiaLogo";
import { V2Button } from "@/v2/components/V2Button";

type ConsultationLayoutProps = {
  children: ReactNode;
  /** Legacy single end action */
  onEnd?: () => void;
  showEnd?: boolean;
  /** Session controls: stop / start agent */
  agentRunning?: boolean;
  onStopAgent?: () => void;
  onStartAgent?: () => void;
};

export function ConsultationLayout({
  children,
  onEnd,
  showEnd = false,
  agentRunning,
  onStopAgent,
  onStartAgent,
}: ConsultationLayoutProps) {
  const showAgentControls =
    typeof agentRunning === "boolean" && (onStopAgent || onStartAgent);

  return (
    <div className="v2-root flex min-h-screen flex-col">
      <header className="border-b border-healia-border-subtle bg-healia-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-page items-center justify-between px-5 md:px-8 lg:px-12">
          <Link
            to="/"
            className="flex items-center gap-2 text-healia-text transition-opacity hover:opacity-80"
          >
            <HealiaLogo
              markClassName="h-7 w-7"
              wordClassName="font-serif text-lg font-semibold tracking-tight"
            />
          </Link>

          {showAgentControls ? (
            <div className="flex items-center gap-2">
              {agentRunning ? (
                <V2Button
                  variant="secondary"
                  onClick={onStopAgent}
                  className="px-4 py-2 text-sm"
                >
                  Stop
                </V2Button>
              ) : (
                <V2Button
                  onClick={onStartAgent}
                  className="px-4 py-2 text-sm"
                >
                  Start
                </V2Button>
              )}
              {agentRunning && onEnd && (
                <V2Button
                  variant="text"
                  onClick={onEnd}
                  className="px-3 py-2 text-sm"
                >
                  End &amp; get guidance
                </V2Button>
              )}
            </div>
          ) : showEnd && onEnd ? (
            <V2Button
              variant="secondary"
              onClick={onEnd}
              className="px-4 py-2 text-sm"
            >
              End consultation
            </V2Button>
          ) : (
            <div className="w-[120px]" aria-hidden="true" />
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
