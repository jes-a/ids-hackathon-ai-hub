import { RoleSelector } from '@/components/RoleSelector';

function CarbonLogo() {
  return (
    <span className="home-logo" aria-hidden>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="0" fill="#0f62fe" />
        <line x1="8" y1="11" x2="24" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="square" />
        <line x1="8" y1="16" x2="24" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="square" />
        <line x1="8" y1="21" x2="24" y2="21" stroke="white" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
    </span>
  );
}

export default function Home() {
  return (
    <main className="home-page">
      <div className="home-hero">
        <h1 className="home-title">
          <CarbonLogo />
          Carbon Design System
        </h1>
        <p className="home-subtitle">AI Hub</p>
        <p className="home-description">
          Select your role to personalize your experience.
        </p>
      </div>
      <div className="home-cards">
        <RoleSelector />
      </div>
      <footer className="home-footer">
        <p className="home-footer-text">
          Powered by AI · Grounded in official Carbon documentation
        </p>
      </footer>
    </main>
  );
}
