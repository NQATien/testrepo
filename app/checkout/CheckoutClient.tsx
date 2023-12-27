'use client'
import { useCart } from "@/hooks/useCart";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { loadBindings } from "next/dist/build/swc";
import { useRouter } from "next/navigation";

import { use, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CheckoutForm from "./CheckoutForm";
import Button from "../ components/Button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)
const CheckoutClient = () => {
    const {cartProducts,paymentIntent,handleSetPaymentIntent}=useCart();
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(false);
    const router = useRouter()
    const [clientSecret,setClientSecret]=useState('')
    const [paymentSuccess,setPaymentSuccess] = useState(false)
    console.log("paymentIntent",paymentIntent);
    console.log("clientSecret",clientSecret);
    useEffect(()=>{
        if(cartProducts)
        {
        setLoading(true)
        setError(false)
        fetch('/api/create-payment-intent',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                items:cartProducts,
                payment_intent_id:paymentIntent
            })
        }).then((res)=>{setLoading(false)
        if(res.status==401){
            return router.push('/login')
        }
        return res.json()
    }).then((data)=>{
        setClientSecret(data.paymentIntent.client_secret)
        handleSetPaymentIntent(data.paymentIntent.id)
    }).catch((error)=>{
         setError(true);
         console.log("Error",error);
         toast.error("Đã xảy ra lỗi");
    })
        }
    },[cartProducts,paymentIntent]);
    const options:StripeElementsOptions={
        clientSecret,
        appearance:{
            theme:'stripe',
            labels:'floating'
        }
    };
    const handleSetPaymentSuccess = useCallback((value:boolean)=>{
        setPaymentSuccess(value)
    },[]);
    return (  <div className="w-full"> 
    {clientSecret && cartProducts && (
        <Elements options={options} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} 
            handleSetPaymentSuccess={handleSetPaymentSuccess}/>
        </Elements> 
    )}
    {loading&& <div className="text-center"> Đang tải thanh toán... </div>}
    {error && <div className="text-center text-rose-500 ">Đã xảy ra lỗi...</div>}
    {paymentSuccess &&(
    <div className="flex items-center flex-col gap-4">
        <div className="text-teal-500 text-center">Thanh toán thành công</div>
        <div className="max-w-[220px] w-full "><Button label="Xem đơn đặt hàng của bạn" onClick={()=> router.push('/orders')}/></div>
    </div>)}
    </div>);
}
 
export default CheckoutClient;