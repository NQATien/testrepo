"use client"
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import Heading from "../ components/Heading";
import Button from "../ components/Button";
import ItemContent from "./ItemContent";
import { formatPrice } from "@/utils/formatPrice";
import { SafeUser } from "@/types";
import Checkout from "../checkout/page";
import { useRouter } from "next/navigation";

interface CartClientProps{
    currentUser: SafeUser|null;
}

const CartClient:React.FC<CartClientProps> = ({currentUser}) => {
    const {cartProducts,handleClearCart,cartTotalAmount} = useCart();

    const router=useRouter()

    if(!cartProducts || cartProducts.length ===0)
    {
    return ( 
    <div className="flex flex-col items-center">
        <div className="text-2xl">Giỏ của bạn trống </div>
        <div>
            <Link  href={"/"} className="text-slate-500 flex items-center gap-1 mt-2">
                <MdArrowBack/>
            <span>
            Bắt đầu mua sắm
            </span>
            </Link>
        </div>
    </div> );
    }




    return(
        <div>
        <Heading title="Giỏ hàng" center/>
        <div className="grid 
        grid-cols-5 
        text-xs 
        gap-4
         pb-2 
         items-center 
         mt-8">
            
            <div className="col-span-2 justify-self-start">Sản phẩm</div>
            <div className="justify-self-center">Giá</div>
            <div className="justify-self-center">Số lượng</div>
            <div className="justify-self-end">Tổng cộng</div>
            </div>
            <div>{cartProducts && cartProducts.map((item)=>{
                return <ItemContent key={item.id} item={item}/>;
            })}
                </div>
                <div className="border-t-[1.5px] border-slate-200 py-4 flex justify-between gap-4">
                    <div className="w-[90px]">
                        <Button label="Xóa tất cả " onClick={()=>{handleClearCart()
                        }} small outline />
                    </div>
                    <div className="text-sm flex flex-col gap-1 items-start">
                        <div className="flex justify-between w-full text-base font-semibold">
                            <span>Tổng phụ</span>
                            <span>{formatPrice(cartTotalAmount)}</span>
                            </div>
                            <p className="text-slate-500">Tính thuế và phí vận chuyển khi thanh toán</p>
                            <Button label={currentUser? 'Thanh toán':"Đăng nhập để thanh toán" } 
                            outline={currentUser? false:true}
                            onClick={()=>{
                                currentUser? router.push('/checkout'):router.push('/login');
                            }}/>
                            <Link  href={"/"} className="text-slate-500 flex items-center gap-1 mt-2">
                <MdArrowBack/>
            <span>
            Tiếp tục mua sắm
            </span>
            </Link>
                            </div>
                        </div>
                    </div>
    );
};
 
export default CartClient;