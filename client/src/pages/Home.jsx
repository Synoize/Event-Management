import { useAuth } from "../contexts/AuthContext";
import LandingPage from "./LandingPage";
import OnboardingPage from "./OnboardingPage";

const Home = () => {
  const {isAuthenticated } = useAuth();

  return (
    <>
      {!isAuthenticated ? <LandingPage/> : <LandingPage />} 
    </>
  );
};

export default Home;

