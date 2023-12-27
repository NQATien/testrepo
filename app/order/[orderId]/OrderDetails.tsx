'use client'
import Heading from "@/app/ components/Heading";
import { formatPrice } from "@/utils/formatPrice";
import { Order } from "@prisma/client";
import { MdAccessTimeFilled, MdDeliveryDining, MdDone } from "react-icons/md";
import Status from "@/app/ components/Status";
import moment from "moment";
import OrderItem from "./OrderItem";

interface OrderDetailsProps {
    order: Order;
  }
  
  const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
    // Calculate the total amount
    const totalAmount = order.products.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  
    return (
      <div className="max-w-[1150px] m-auto flex flex-col gap-2">
        <div className="mt-8">
          <Heading title="Chi tiết đặt hàng" />
        </div>
        <div>Order ID: {order.id}</div>
        <div>
          Total Amount: <span className="font-bold">{formatPrice(totalAmount)}</span>
        </div>
        <div className="flex gap-2 items-center">
          <div>Delivery status:</div>
          <div>
            {order.deliveryStatus === "pending" ? (
              <Status
                text="pending"
                icon={MdAccessTimeFilled}
                bg="bg-slate-200"
                color="text-slate-700"
              />
            ) : order.deliveryStatus === "dispatched" ? (
              <Status
                text="dispatched"
                icon={MdDeliveryDining}
                bg="bg-purple-200"
                color="text-purple-700"
              />
            ) : order.deliveryStatus === "delivered" ? (
              <Status
                text="delivered"
                icon={MdDone}
                bg="bg-green-200"
                color="text-green-700"
              />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div>Date: {moment(order.createDate).fromNow()}</div>
        <div>
          <h2 className="font-semibold mt-4 mb-2">Sản phẩm đã đặt hàng</h2>
          <div className="grid grid-cols-5 text-sx gap-4 pb-2 items-center">
            <div className="col-span-2 justify-self-start">Sản phẩm</div>
            <div className="justify-self-center">Gía</div>
            <div className="justify-self-center">Số lượng</div>
            <div className="justify-self-end">Tổng cộng</div>
          </div>
          {order.products &&
            order.products.map((item) => {
              return <OrderItem key={item.id} item={item}></OrderItem>;
            })}
        </div>
      </div>
    );
  };
  
  export default OrderDetails;