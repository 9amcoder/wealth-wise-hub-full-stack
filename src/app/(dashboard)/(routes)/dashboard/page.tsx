import { UserButton } from "@clerk/nextjs";

interface DashBoardPageProps {
    
}
 
const DashBoardPage: React.FC<DashBoardPageProps> = () => {
    return ( 
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="mb-5">Dashboard page </h1>
            <UserButton afterSignOutUrl="/" />
        </div>
     );
}
 
export default DashBoardPage;