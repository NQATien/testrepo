import { getCurrentUser } from "@/actions/getCurrentUser"
import NullData from "../ components/NullData"
import Container from "../ components/Container"
import OrderClient from "./OrderClient"
import getOrdersByUserId from "@/actions/getOrdersByUserId"

const Orders =async()=>{
    const currentUser=await getCurrentUser()
    if(!currentUser){
        return <NullData title="Rất tiếc !Quyền truy cập bị từ chối"/>
    }
    const orders=await getOrdersByUserId(currentUser.id)
    if(!orders){
        return <NullData title="Chưa có đơn đặt hàng nào..."/>
    }
    return (
        <div className="pt-8">
            <Container>
                <OrderClient orders={orders}/>
            </Container>
        </div>
    )
}   
export default Orders