"use client";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

interface DashBoardNavProps {}

const DashBoardNav: React.FC<DashBoardNavProps> = () => {
 
  return (
    <div className="flex item-center p-4 hidden sm:block md:border">
      <div className="flex w-full justify-end">
        <div className="flex items-center space-x-4">
        <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default DashBoardNav;