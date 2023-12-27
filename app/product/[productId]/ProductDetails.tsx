'use client';
import { useRouter } from 'next/navigation';
import Button from "@/app/ components/Button";
import ProductImage from "@/app/ components/products/ProductImage";
import SetColor from "@/app/ components/products/SetColor";
import SetQuantity from "@/app/ components/products/SetQuantity";
import { useCart } from "@/hooks/useCart";
import { products } from "@/utils/products";
import { Rating } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";

interface ProductDetailsProps{
    product:any
}
export type CartProductType = {
    id: string, 
    name: string,
    description:string,
    category:string,
    brand:string,
    selectedImg:SelectedImgType,
    quantity:number,
    inStock: boolean,
    price:number

}
export type SelectedImgType={
    color:string,
    colorCode: string,
    image:string
}
const Horizontal=() =>{
    return (<hr className="w-[30%] my-2"/>)
};
const ProductDetails:React.FC<ProductDetailsProps> = ({product}) => {
    const { handleAddProductToCart, cartProducts } = useCart();
    const[isProductIncart,setIsProductInCart]=useState(false);
    const [cartProduct, setCartProduct]=useState<CartProductType>({
        id:product.id, 
        name:product.name,
        description:product.description,
        category:product.category,
        brand:product.brand,
        selectedImg:{...product.images[0]},
        quantity:1,
        inStock: product.inStock,  // Thêm trường inStock vào đây
        price:product.price,
    });
    const router = useRouter();
    console.log(cartProducts)
    useEffect(()=>{
        setIsProductInCart(false)
        if(cartProducts)
        {
        const existingIndex = cartProducts.findIndex((item)=>item.id === product.id );
        if(existingIndex>-1)
        {
            setIsProductInCart(true); 
        }
        }
    },[cartProducts]);
    const productRating=  
    product.reviews.reduce((acc:number, item:any)=> item.rating + acc,0 ) / product.reviews.length

    const handleColorSelect = useCallback((value:SelectedImgType)=>{setCartProduct((prev)=>{
        return {...prev, selectedImg:value}
    })}, [cartProduct.selectedImg]);

    const handleQtyIncrease =useCallback(()=>{
        if(cartProduct.quantity ==99    )
        {
            return;
        }
        setCartProduct((prev)=>{
            return{...prev, quantity:prev.quantity +1};
        });
    },[cartProduct]);
    const handleQtyDecrease =useCallback(()=>{
        if(cartProduct.quantity ===1)
        {
            return;
        }
        setCartProduct((prev)=>{
        return{...prev, quantity: prev.quantity-1};
    });},[cartProduct]);

    return ( <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ProductImage cartProduct={cartProduct} product={product} handleColorSelect={handleColorSelect}/>
        <div className="flex flex-col gap-1 text-slate-500 text-sm">
            <h2 className="text-3x1 font-medium text-slate-700">{product.name}</h2>
            <div className="flex item-center gap-2">
                <Rating value={productRating} readOnly/>
                <div>{product.reviews.length} đánh giá</div>
            </div>
            <Horizontal/>
            <div className="text-justify">{product.description}</div>
            <Horizontal/>
            <div>
                <span className="font-semibold">Loại:</span>{product.category}
            </div>
            <div>
                <span className="font-semibold">Thương hiệu:</span>{product.brand}
            </div>
            <div className={product.inStock?'text-teal-400':'text-rose-400'}>{product.inStock ? 'Vẫn còn hàng' : 'Đã hết hàng'}</div>
        <Horizontal/> 
        {
            isProductIncart ?  (<>
            <p className="mb-2 text-slate-500 flex items-center gap-1">
                <MdCheckCircle className="text-teal-400" size={20}/>
                    <span>Sản phẩm được thêm vào</span>
            </p>
            <div>
                <Button label="Xem giỏ hàng" outline onClick={() =>{
                    router.push("/cart");
                }}
                />
            </div>
            </> ):(<>
        <SetColor
        cartProduct={cartProduct}
        images={product.images}
        handleColorSelect={handleColorSelect} 
        />
        <Horizontal/>
      <SetQuantity cartProduct={cartProduct}
      handleQtyIncrease={handleQtyIncrease}
      handleQtyDecrease={handleQtyDecrease}
      />
        <Horizontal/>
        <div className="max-w-[300px]">
         <Button
            label="Thêm vào giỏ hàng"
            onClick={() => handleAddProductToCart(cartProduct)}
         />
         </div>
         </>)}
        </div>
    </div> );
}
 
export default ProductDetails;