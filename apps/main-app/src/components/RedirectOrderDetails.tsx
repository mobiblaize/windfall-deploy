import { useSearchParams } from "react-router-dom";
import RedirectWithLoading from "../components/RedirectWithLoading";

export default function RedirectOrderDetails() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  const redirectTo = orderId
    ? `/profile/transaction/receipt/${orderId}`
    : "/profile/transaction";

  return <RedirectWithLoading to={redirectTo} replace={true} />;
}