"use client"
import { CartProductType } from "@/app/product/[productId]/ProductDetails";

import { createContext,useCallback,useContext,useEffect,useState } from "react";
import toast, { Toast } from "react-hot-toast";

type CartContextType ={
    cartTotalQty:number;
    cartTotalAmount: number;
    cartProducts:CartProductType[] | null;
    handleAddProductToCart:(product:CartProductType)=> void;
    handleRemoveProductFromCart:(product:CartProductType)=> void;
    handleCartQtyIncrease:(product:CartProductType)=> void;
    handleCartQtyDecrease:(product:CartProductType)=> void;
    handleClearCart:()=> void;
    paymentIntent:string|null;
    handleSetPaymentIntent:(val:string|null)=>void;
}

export const CartContext =  createContext<CartContextType|null>(null);
interface Props{
    [propName:string]:any;
}
export const CartContextProvider = (props: Props) => {
    const [cartTotalQty, setCartTotalQty] = useState(0);
    const[cartTotalAmount,setCartTotalAmount]=useState(0)
    const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(null);
    const [paymentIntent,setPaymentIntent]=useState<string | null>(null)
    console.log('qty',cartTotalQty)
    console.log('amount',cartTotalAmount)
    // Initialize cart products from local storage when the component mounts.
    useEffect(() => {
        const cartItems: any = localStorage.getItem('eShopCartItems');
        const cProducts: CartProductType[] | null = JSON.parse(cartItems);
        const LuxeGlobalPaymentIntent:any =  localStorage.getItem('LuxeGlobalPaymentIntent');
        const paymentIntent :string|null =JSON .parse(LuxeGlobalPaymentIntent);
        setCartProducts(cProducts);
        setPaymentIntent(paymentIntent);
    }, []);
    
    useEffect(()=>{
        const getTotals =()=>{
            if(cartProducts){
            const{ total,qty}=cartProducts?.reduce((acc,item)=>{
                const itemTotal = item.price * item.quantity
                acc.total += itemTotal
                acc.qty += item.quantity
                return acc;
            },
            {
                total:0,
                qty:0
            }
            );
        setCartTotalQty(qty);
       setCartTotalAmount(total);
        }};
        getTotals()
    },[cartProducts])

    
    const handleAddProductToCart = useCallback((product: CartProductType) => {
        // Kiểm tra nếu sản phẩm không còn hàng (Out of Stock), thì không thực hiện thêm vào giỏ hàng
        if (!product.inStock) {
            toast.error("Sản phẩm đã hết hàng.");
            return;
        }
    
        setCartProducts((prev) => {
            let updatedCart;
    
            if (prev) {
                updatedCart = [...prev, product];
            } else {
                updatedCart = [product];
            }
    
            toast.success("Sản phẩm đã được thêm vào giỏ hàng");
            localStorage.setItem('Giỏ hàng các mặt hàng', JSON.stringify(updatedCart));
            return updatedCart;
        });
    }, []);
    
    // Define a function to remove a product from the cart.
    const handleRemoveProductFromCart = useCallback((product: CartProductType) => {
        if (cartProducts) {
            const filteredProducts = cartProducts.filter((item) => item.id !== product.id);
            setCartProducts(filteredProducts);
            toast.success("Sản phẩm đã bị xóa khỏi giỏ hàng");
            localStorage.setItem("Giỏ hàng các mặt hàng", JSON.stringify(filteredProducts));
        }
    }, [cartProducts]);
        const handleCartQtyIncrease = useCallback((product:CartProductType)=>{
            let updatedCart;
            if(product.quantity ==99)
            {
                return toast.error("Quá số lượng rồi!")
            }
            if(cartProducts){
                updatedCart = [...cartProducts]
                const existingIndex = cartProducts.findIndex((item)=>item.id === product.id );
                if(existingIndex > -1 ){
                    updatedCart[existingIndex].quantity = 
                    ++ updatedCart[existingIndex].quantity 
                }
                setCartProducts(updatedCart);
                localStorage.setItem('Giỏ hàng các mặt hàng',JSON.stringify(updatedCart))
            }
        },[cartProducts]);

        //giam so luong san pham
        const handleCartQtyDecrease = useCallback((product:CartProductType)=>{
            let updatedCart;
            if(product.quantity ==1)
            {
                return toast.error("Không thể giảm được nữa!")
            }
            if(cartProducts){
                updatedCart = [...cartProducts]
                const existingIndex = cartProducts.findIndex((item)=>item.id === product.id );
                if(existingIndex > -1 ){
                    updatedCart[existingIndex].quantity = 
                    -- updatedCart[existingIndex].quantity 
                }
                setCartProducts(updatedCart);
                localStorage.setItem('Giỏ hàng các mặt hàng',JSON.stringify(updatedCart))
            }
        },[cartProducts]);

        const handleClearCart = useCallback(()=>{
            setCartProducts(null)
            setCartTotalQty(0)
            localStorage.setItem('Giỏ hàng các mặt hàng',JSON.stringify(null));
        },[cartProducts]);
        const handleSetPaymentIntent = useCallback((val:string|null)=>{setPaymentIntent(val)
        localStorage.setItem('Ý định thanh toán của LuxeGlobal',JSON.stringify(val));
        },[paymentIntent])
    // Provide the cart context value to consumers.
    const value = {
        cartTotalQty,
        cartTotalAmount,
        cartProducts,
        handleAddProductToCart,
        handleRemoveProductFromCart,
        handleCartQtyIncrease,
        handleCartQtyDecrease,
        handleClearCart,
        handleSetPaymentIntent,
        paymentIntent,
    };

    return <CartContext.Provider value={value} {...props} />;
};

export const useCart =()=>{
     const context = useContext(CartContext);
     if(context=== null)
     {
        throw new Error("sử dụng Giỏ hàng phải được sử dụng trong Nhà cung cấp bối cảnh giỏ hàng")
     }
     return context;
};

