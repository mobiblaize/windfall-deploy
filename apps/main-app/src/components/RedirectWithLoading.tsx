import { Navigate } from "react-router-dom";
import LoadingState from "./LoadingState";

interface RedirectWithLoadingProps {
  to: string;
  replace?: boolean;
  delay?: number;
}

const RedirectWithLoading: React.FC<RedirectWithLoadingProps> = ({
  to,
  replace = false,
}) => {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingState description="Redirecting..." />
        </div>
      </div>
      <Navigate to={to} replace={replace} />
    </>
  );
};

export default RedirectWithLoading;
