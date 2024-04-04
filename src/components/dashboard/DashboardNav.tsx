"use client";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";
import { useParams, usePathname } from "next/navigation";

const DashBoardNav: React.FC = () => {
  const { user, isLoaded } = useUser();
  let pathname = usePathname();
  const params = useParams();

  // Check if params contain an ID
  if (params.id) {
    // Remove the ID from the pathname
    const pathParts = pathname.split('/');
    pathname = pathParts.slice(0, pathParts.length - 1).join('/');
  }

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