const title = "WealthWise Hub";
const description = "Let's grow together";

const AuthLayout = ({ children } : {
    children: React.ReactNode;
}) => {
    return (
       <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-1/2 flex items-center justify-center">
                {children}
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center bg-blue-950">
                <div className="text-center">
                    <h1 className="text-yellow-500 text-lg md:text-3xl text-bold mb-5" >{title}</h1>
                    <p className="text-yellow-500 text-sm md:text-lg"> {description}</p>
                    {/* <img src="logo.png" alt="Business Logo" /> */}
                </div>
            </div>
       </div>
    );
}

export default AuthLayout;