import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function RedirectOrderDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const orderId = searchParams.get("order_id");

    if (orderId) {
      navigate(`/profile/transaction/receipt/${orderId}`, { replace: true });
    } else {
      // fallback if order_id missing
      navigate("/profile/transaction", { replace: true });
    }
  }, [searchParams, navigate]);

  return null;
}
