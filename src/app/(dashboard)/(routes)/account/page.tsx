import { UserButton, UserProfile } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";

interface AccountPageProps {
    
}
 
const AccountPage: React.FC<AccountPageProps> = () => {
    return ( 
        <div className="flex justify-center w-full min-h-screen">
            <UserProfile/>
        </div>
     );
}
 
export default AccountPage;