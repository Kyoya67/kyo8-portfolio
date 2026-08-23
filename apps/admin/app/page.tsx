import { PanelFrame, PanelHeading, BracketButton } from "@kyo8/ui";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <PanelFrame className="animate-fade-up">
        <PanelHeading number="01" title="Dashboard" />
        <div className="flex flex-col gap-6 px-6 py-10">
          <p className="text-xs tracking-[0.1em] text-fg-muted uppercase">
            KYO8.dev content management
          </p>
          <div>
            <BracketButton href="/profile" solid>
              Profile
            </BracketButton>
          </div>
        </div>
      </PanelFrame>
    </div>
  );
}
