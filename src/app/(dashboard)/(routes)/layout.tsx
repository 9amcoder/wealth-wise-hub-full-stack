import DashBoardNav from "@/components/dashboard/DashboardNav";
import SideBar from "@/components/dashboard/DashboardSideBar";
import { MobileNav } from "@/components/dashboard/MobileNav";
import React, { ReactNode } from "react";

const DashboardLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    return ( 
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z[80] bg-gray-900">
               <SideBar />
            </div>
            <main className="md:pl-72">
                <MobileNav />
                <DashBoardNav />
                {children}
            </main>
        </div>
     );
} 
 
export default DashboardLayout;