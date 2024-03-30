
import AnimatedText from "@/components/auth/AnimatedText";
import Image from "next/image";

const title = "WealthWise Hub";
const description = "Let's Grow Together";

const AuthLayout = ({ children } : {
    children: React.ReactNode;
}) => {
    return (
       <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-1/2 flex items-center justify-center">
                {children}
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center bg-black">
                <div className="text-center">
                    <h1 className="text-yellow-500 text-lg md:text-3xl text-bold mb-5" >{title}</h1>
                    <AnimatedText />
                    {/* <p className="text-yellow-500 text-sm md:text-lg"> {description}</p> */}
                    {/* <img src="logo.png" alt="Business Logo" /> */}
                    {/* <Image src="/coin2.gif" alt="Business Logo" width={200} height={200} /> */}
                </div>
            </div>
       </div>
    );
}

export default AuthLayout;