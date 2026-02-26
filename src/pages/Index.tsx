import { useApp } from "@/context/AppContext";
import LandingPage from "@/pages/LandingPage";
import OnboardingFlow from "@/pages/OnboardingFlow";
import Dashboard from "@/pages/Dashboard";

const Index = () => {
  const { appState } = useApp();

  if (appState === "landing") return <LandingPage />;
  if (appState === "onboarding") return <OnboardingFlow />;
  return <Dashboard />;
};

export default Index;
