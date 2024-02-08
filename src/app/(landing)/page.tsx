import LandingComponent from "@/components/LandingComponent";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LandingPageProps {}

const LandingPage: React.FC<LandingPageProps> = () => {
  return (
    // <div className="flex flex-col items-center justify-center min-h-screen">
    //   <h1 className="mb-4">Welcome to WealthWise Hub </h1>
    //   <Link href="/sign-in">
    //     <Button className="mb-2">Sign In</Button>
    //   </Link>
    //   <Link href="/sign-up">
    //     <Button>Sign Up</Button>
    //   </Link>
    // </div>
    <LandingComponent />
  );
};

export default LandingPage;
