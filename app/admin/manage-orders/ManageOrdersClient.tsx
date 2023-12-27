'use client'

import { Order,  User } from "@prisma/client";
import {DataGrid, GridColDef} from '@mui/x-data-grid'
import { formatPrice } from "@/utils/formatPrice";
import { MdAccessTimeFilled, MdCached, MdCancel, MdClose, MdDelete, MdDeliveryDining, MdDone, MdRemoveRedEye } from "react-icons/md";
import Status from "@/app/ components/Status";
import ActionBtn from "@/app/ components/ActionBtn";
import Heading from "@/app/ components/Heading";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";


interface ManageOrdersClientProps{
    orders:ExtendedOrder[]
}
type ExtendedOrder = Order&{
    user:User
}
const ManageOrdersClient:React.FC<ManageOrdersClientProps> = ({orders}) => {
 const router=useRouter();
    let rows:any=[]
    if(orders)
    {
        rows=orders.map((order)=>{
            return{
                id:order.id,
                customer:order.user.name,
                amount:formatPrice(order.amount/100),
                paymentStatus:order.status,
                date:moment(order.createDate).fromNow(),
                deliveryStatus:order.deliveryStatus,
            };
        });
    }
    const columns:GridColDef[]=[
        {field:'id',headerName:'Mã khách hàng',width:220},
        {field:'customer',headerName:'Tên khách hàng',width:130},
        {field:'amount',headerName:'Tiền(VNĐ)',width:130,renderCell:(params)=>{
            return(<div className="font-bold text-slate-800">{params.row.amount}</div>);
        },
    },
    {field:'deliveryStatus',headerName:"Tình trạng giao hàng",width:130,renderCell:(params)=>{
        return(<div>{params.row.deliveryStatus=='pending'?
            (
            <Status text="chưa giải quyết"
            icon={MdAccessTimeFilled}
            bg="bg-teal-200"
            color="text-teal-700"
            />
            ):params.row.deliveryStatus=='dispatched'?(
                <Status text="hoàn thành" icon={MdDeliveryDining}
                bg="bg-purple-200"
                color="text-purple-700"
                />
                ): params.row.deliveryStatus=='delivered'?
                (  <Status text="đang giao" 
                icon={MdDone}
                bg="bg-green-200"
                color="text-green-700"
                />
                ):<></>}
                </div>
        );
    },
    },
        {field:'paymentStatus',headerName:"Tình trạng thanh toán",width:130,renderCell:(params)=>{
    return(<div>{params.row.paymentStatus=='pending'?
        (
        <Status text="chưa giải quyết"
        icon={MdAccessTimeFilled}
        bg="bg-teal-200"
        color="text-teal-700"
        />
        ):  params.row.paymentStatus=='complete'?(
            <Status text="hoàn thành" icon={MdDone}
            bg="bg-purple-200"
            color="text-purple-700"
            />
            ) :( <></>  
            
            )}
            </div>
    );
    },
    },
{
    field:"date",
    headerName:"Thời gian",
    width:130,
},
    {field:"action",headerName:"Hành động",width:200,renderCell:(params)=>{
        return(<div className="flex justify-between gap-4 w-full">
            <ActionBtn icon={MdDeliveryDining} onClick={()=>{handleDispatch(params.row.id);}}/>
            <ActionBtn icon={MdDone} onClick={()=>{handleDeliver(params.row.id)}}/>
            <ActionBtn icon={MdRemoveRedEye} onClick={()=>{router.push(`/order/${params.row.id}`)}}/>
            
            </div>);}
    }
];
const handleDispatch = useCallback((id: string) => {
    axios.put('/api/order', {
        id,
        deliveryStatus:'dispatched'
    })
    .then((res) => {
        toast.success('Đơn hàng đã được gửi đi ');
        router.refresh();
    })
    .catch((err) => {
        toast.error('Rất tiếc! Đã xảy ra lỗi');
        console.log(err);
    });
}, []);
 

const handleDeliver = useCallback((id: string) => {
    axios.put('/api/order', {
        id,
        deliveryStatus:'delivered'
    }) 
    .then((res) => {
        toast.success('Giao hàng');
        router.refresh();
    })
    .catch((err) => {
        toast.error('Rất tiếc! Đã xảy ra lỗi');
        console.log(err);
    });
}, []);
 
    return ( <div className="max-w-[1150px] m-auto text-x1">
        <div className="mb-4 mt-8">
            <Heading title="Quản lý đơn hàng" center />
        </div >
        <div style={{height:600 ,width:"100%"}}>
        <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 9 },
          },
        }}
        pageSizeOptions={[9, 20]}
        checkboxSelection
        disableRowSelectionOnClick
      /></div> </div>);
}
 
export default ManageOrdersClient;


