import { useCart } from '../../utils/hooks/useCart';
import Signup from '../auth/Signup';

const CheckoutAuth = () => {
    const { cart } = useCart();

    return (
        <Signup returnUrl="/checkout" cart={cart} />
    );
};

export default CheckoutAuth;