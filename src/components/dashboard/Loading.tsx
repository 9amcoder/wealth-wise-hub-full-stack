import { FunctionComponent } from "react";

interface LoadingComponentProps {}

const LoadingComponent: FunctionComponent<LoadingComponentProps> = () => {
  return (
    <div className="flex items-center justify-center h-3/4-screen">
      <div className="loader ease-linear rounded-full border-t-8 border-blue-500 border-solid h-24 w-24"></div>
    </div>
  );
};

export default LoadingComponent;