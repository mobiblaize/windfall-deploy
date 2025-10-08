import { useCart } from '../../utils/hooks/useCart';
import Signup from '../auth/Signup';

const CheckoutAuth = () => {
    const { cart, transferCart } = useCart();

    return (
        <Signup returnUrl="/checkout" cart={cart} transferCart={transferCart} />
    );
};

export default CheckoutAuth;