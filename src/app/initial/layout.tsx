import DashBoardNav from "@/components/dashboard/DashboardNav";
import React, { ReactNode } from "react";

const InitialLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    return ( 
        <div className="h-full">
            <DashBoardNav />
            {children}
        </div>
     );
} 
 
export default InitialLayout;