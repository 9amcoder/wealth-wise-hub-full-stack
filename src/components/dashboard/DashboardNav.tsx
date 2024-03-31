"use client";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";
import { usePathname } from "next/navigation";

interface DashBoardNavProps {}

const DashBoardNav: React.FC<DashBoardNavProps> = () => {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  return (
    <div className="hidden sm:flex items-center justify-between p-4 w-full md:border border-none bg-gradient-to-r from-emerald-50 to-green-100">
      <div className="font-bold text-xl ">
        {pathname.replace("/", "").charAt(0).toUpperCase() +
          pathname.replace("/", "").slice(1).toLowerCase()}
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-[#282458]">
          {isLoaded ? `Hello, ${user?.firstName || "Guest"}` : "Loading..."}
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default DashBoardNav;
