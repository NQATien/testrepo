'use client'

import { Order,Product, User } from "@prisma/client"
import { useEffect, useState } from "react";
import Heading from "../ components/Heading";

import { formatPrice } from "@/utils/formatPrice";
import { formatNumber } from "@/utils/formatNumber";


interface SummaryProps{
    orders:Order[];
    products:Product[];
    users:User[]
}

type SummaryDataType={
    [key:string]:{
        lable:string;
        digit:number;
    }
}

const Summary:React.FC<SummaryProps> = ({orders,products,users}) => {
  const [summaryData,setSummaryData]=useState<SummaryDataType>({
        sale:{
            lable:'Tổng doanh thu',
            digit:0
        },
        products:{
            lable:'Tổng số sản phẩm',
            digit:0
        },
        orders:{
            lable:'Tổng số sản phẩm',
            digit:0
        },
        paidOrders:{
            lable:'Đơn đặt hàng đã thanh toán',
            digit:0
        },
        unpaidOrders:{
            lable:'Đơn đặt hàng đã thanh toán',
            digit:0
        },
       
        users:{
            lable:'Tổng số người dùng',
            digit:0
        },
  })
  useEffect(()=>{
    setSummaryData((prev)=>{
        let tempData={...prev}
        const totalSale=orders.reduce((acc,item)=>{
            if(item.status==='complete'){
                return acc+ item.amount
            }else return acc
        },0)
        const paidOrders=orders.filter((order=>{
            return order.status==='complete'
        }))
        const unpaidOrders=orders.filter((order=>{
            return order.status==='pending'
        }))

        tempData.sale.digit=totalSale;
        tempData.orders.digit=orders.length;
        tempData.paidOrders.digit=paidOrders.length;
        tempData.unpaidOrders.digit=unpaidOrders.length;
        tempData.products.digit=products.length;
        tempData.users.digit=users.length;

        return tempData
    })
  },[orders,products,users])

    const summaryKeys=Object.keys(summaryData)

    return (
    <div className="max-w-[1150px m-auto]">
        <div className="mb-4 mt-8">
            <Heading title="Thống kê" center/>
        </div>
        <div className="grid grid-cols-2 gap-3 max-h-50vh overflow-y-auto">
            {
                summaryKeys && summaryKeys.map((key)=>{
                    return <div key={key} className="rounded-xl border-2 p-4 flex flex-col item-center gap-2 transition">
                    <div>
                        {
                            summaryData[key].lable==='TotalSale'?<>{formatPrice
                                (summaryData[key].digit)}</>:
                                <>{formatNumber (summaryData[key].digit)}</>
                        }
                    </div>
                    <div>{summaryData[key].lable}</div>
                </div>
                                       
                })
            }
        </div>
    </div>
  );
}

export default Summary