import { Gem, Import, Menu, SmilePlus } from "lucide-react";
import Link from "next/link";

interface LandingComponentProps {}

const LandingComponent: React.FC<LandingComponentProps> = () => {
  return (
    <>
      <section className="w-full py-12 lg:py-16 bg-gradient-to-r from-[#667eea] to-[#764ba2]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl">
                Welcome to <span className="text-yellow-500">WealthWise</span>{" "}
                Hub
              </h1>
              <p className="max-w-[600px] text-gray-100 md:text-xl/relaxed dark:text-gray-400">
                Take control of your personal finances with our simple and
                secure platform.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-8 text-sm font-medium shadow-sm text-gray-900 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                href="/sign-up"
              >
                Sign Up
              </Link>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                href="/sign-in"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-5">
            <div className="text-center space-y-5">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                How It Works
              </h2>
              <h3 className="text-sm md:text-lg text-gray-500">
                Design to fulfill your Financial Freedom as early as possible in
                simple 3 steps:{" "}
              </h3>
              <div className="grid grid-cols-1 gap-8 mt-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2]">
                    <SmilePlus size={24} color="#fff" />
                  </div>
                  <h3 className="text-xl font-semibold">Create an Account</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Sign up for an account to get started.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2]">
                    <Import size={24} color="#fff" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Record your transactions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Scan your invoice or manual entry
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2]">
                    <Gem size={24} color="#fff" />
                  </div>
                  <h3 className="text-xl font-semibold">Start Managing</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Take control of your personal finances.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="w-full py-6 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6 flex items-center justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 McMaster University. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default LandingComponent;
