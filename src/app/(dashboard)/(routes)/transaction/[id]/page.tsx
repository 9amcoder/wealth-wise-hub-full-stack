"use client";

import UpdateTransactionForm from "@/components/transaction/UpdateTransactionForm";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

interface UpdateTransactionPageProps {
    
}
 
const UpdateTransactionPage: React.FC<UpdateTransactionPageProps> = () => {
    const router = useRouter();
    const params = useParams<{ id: string }>();
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
          <UpdateTransactionForm id={params.id} />
        </div>
      </>
    );
}
 
export default UpdateTransactionPage;