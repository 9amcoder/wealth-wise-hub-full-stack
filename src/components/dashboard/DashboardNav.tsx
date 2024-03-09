"use client";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

interface DashBoardNavProps {}

const DashBoardNav: React.FC<DashBoardNavProps> = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded){
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <div className="flex item-center p-4 hidden sm:block md:border">
      <div className="flex w-full justify-end">
        <div className="flex items-center space-x-4">
          <div className="text-[#282458]">
            Hello, {user?.firstName || "Guest"}
          </div>
        <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default DashBoardNav;