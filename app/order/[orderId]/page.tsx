import Container from "@/app/ components/Container";

import ListRating from "@/app/product/[productId]/ListRating";
import getOrderById from "@/actions/getOrderById";
import NullData from "@/app/ components/NullData";
import OrderDetails from "./OrderDetails";

interface IPrams{
    orderId?:string;
}

const Order= async({params}:{params:IPrams}) => {
    const order=await getOrderById(params);
    if(!order)return 
    <NullData  title="Không có đơn hàng"></NullData>
    return ( 
        <div className="p-8">
            <Container>
               <OrderDetails order={order}/>
            </Container>
        </div>
     );
}
 
export default Order;