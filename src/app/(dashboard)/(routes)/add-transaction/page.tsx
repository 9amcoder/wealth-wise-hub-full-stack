"use client";

import AddTransactionForm from "@/components/transaction/AddTransactionForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

 
const AddTransactionPage: React.FC = () => {
    const router = useRouter();
    return (
        <>
        <div>
          <Button
            onClick={() => router.push(`/transaction`)}
            variant="outline"
            className="m-2"
          >
           Go Back
          </Button>
        </div>
        <div className="flex justify-center items-center mt-5 mb-40 md:mt-10 md:mb-60">
          <AddTransactionForm />
        </div>
      </>
    );
}
 
export default AddTransactionPage;