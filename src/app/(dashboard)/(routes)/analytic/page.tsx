import { Wallet2, CircleDollarSign } from "lucide-react";
interface AnalyticPageProps {
    
}
 
const AnalyticPage: React.FC<AnalyticPageProps> = () => {
    return ( 
    <div className="flex flex-col items-center justify-top">
     <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-5 border-solid border-2 border-gray-200 border-radius:2px rounded-md">
            <div className="text-center space-y-5">
              <div className="grid grid-cols-1 gap-8 mt-8 sm:grid-cols-2 lg:grid-cols-2">
                {/* <div className="flex flex-col items-center space-y-4"> */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#e6bb87] to-[#bfab93]">
                    <Wallet2 size={24} color="#804908" /> 
                  </div> Goals
                {/* </div> */}
                <div className="grid grid-cols-1 divide-x"></div>
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2]">
                    <CircleDollarSign size={24} color="#fff" />
                  </div> Expenses
                </div>
                
                <div className="flex flex-col items-center space-y-4">

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
            <section> GRAPH</section>
        </div>
     );
}
 
export default AnalyticPage;