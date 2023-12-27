'use client'

import Heading from "@/app/ components/Heading";
import CategoryInput from "@/app/ components/inputs/CategoryInput";
import CustomCheckBox from "@/app/ components/inputs/CustomCheckBox";
import Input from "@/app/ components/inputs/Input";
import TextArea from "@/app/ components/inputs/TextArea";
import { categories } from "@/utils/Categories";
import { colors } from "@/utils/Color";
import { register } from "module";
import { useCallback, useEffect, useState } from "react";
import {  FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { setConstantValue } from "typescript";
import {SelectColor} from '@/app/ components/inputs/SelectColor'
import Button from "@/app/ components/Button";
import toast from "react-hot-toast";
import {getDownloadURL, getStorage, ref, uploadBytesResumable}from "firebase/storage"; 
import firebaseApp from "@/libs/firebase";
import { resolve } from "path";
import axios from "axios";
import { useRouter } from "next/navigation";


export type ImageType={
    color:string;
    colorCode:string;
    image:File|null
}
export type UploadImageType={
    color:string;
    colorCode:string;
    image:string;
}
const AddProductForm = () => {
    const  router=useRouter();
    const[isLoading,setIsLoading] = useState(false);
    const [images,setImages]=useState<ImageType[]|null>();
    const [isProductCreated,setIsProductCreated]=useState(false);
 
    const{register,handleSubmit,setValue,watch,reset,formState:{errors}}=useForm<FieldValues>({
        defaultValues:{
            name:'',
            description:'',
            brand:'',
            category:'',
            inStock:false,
            images:[],
            price:"",
        }
    })
    useEffect(()=>{
        setCustomValue('images',images)
    },[images])

    useEffect(()=>{
        if(isProductCreated)
        reset();
    setImages (null);
    setIsProductCreated(false);
    },[isProductCreated]);

    const onSubmit:SubmitHandler<FieldValues> = async(data)=>{
        console.log("Product Data",data);
        //upload images to fb
        //save product to mogodb
        setIsLoading(true)
        let UploadedImages:UploadImageType[]=[]
        if(!data.category){
            setIsLoading(false)
            return toast.error('Danh mục chưa được chọn')
        }
        if(!data.images || data.images.length===0)
        {
            setIsLoading(false)
            return toast.error('Không có hình ảnh nào được chọn!')
        }
        const handleImageUploads = async()=>{
            toast("Đang tạo sản phẩm, vui lòng chờ..");
            try{
                for(const item of data.images)
                {
                    if(item.image){
                          const fileName =new Date().getTime() + '-' + item.image.name;
                        const storage = getStorage(firebaseApp)
                        const storageRef = ref(storage,`products/${fileName}`);
                        const uploadTask = uploadBytesResumable(storageRef,item.image);
                        await new Promise<void>((resolve,reject)=>{
                            uploadTask.on(
                                'state_changed',
                                (snapshot)=>{
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                console.log('Upload is ' + progress + '% done');
                                switch (snapshot.state) {
                                case 'paused':
                                    console.log('Upload is paused');
                                    break;
                                case 'running':
                                    console.log('Upload is running');
                                    break;
                                }
                                },
                                (error)=>{
                                console.log('Error uploading image',error)
                                reject(error)
                                },
                                () => {
                                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                        UploadedImages.push({
                                            ...item,
                                            image:downloadURL,
                                        })
                                        console.log('File available at', downloadURL);
                                      resolve();
                                    }).catch((error)=>{
                                        console.log("Error getting the download URL",error);
                                        reject(error);
                                    });
                                }
                            )
                        })
                    }
                }
            }catch(error){
                    setIsLoading(false)
                    console.log('Error handling image uploads',error);
                    return toast.error ('Lỗi xử lý tải lên hình ảnh');
            }
        };
        await handleImageUploads();
        const productData={...data,images:UploadedImages};

       axios.post('/api/product',productData).then(()=>{
        toast.success('Sản phẩm đã được tạo');
        setIsProductCreated(true);
        router.refresh();
       }).catch((error)=>{
        toast.error('Đã xảy ra lỗi khi lưu sản phẩm vào dữ liệu');
       }).finally(()=>{
        setIsLoading(false);
       });
       };
    
    const category = watch('category');

    const setCustomValue =(id:string,value:any)=>{
        setValue(id,value,{
            shouldValidate:true,
            shouldDirty:true,
            shouldTouch:true,
        })
    }
    const addImageToState = useCallback((value:ImageType)=>{
        setImages((prev)=>{
            if(!prev){
                return[value]
            }
            return [...prev,value]
        })
    },[]);

    const removeImageFromState = useCallback((value:ImageType)=>{setImages((prev)=>{
        if(prev)
        {const filteredImages=prev.filter((item)=>item.color!=value.color
            );
        return filteredImages;
    }
    return prev;
}
)},[])
    return (  <>
    <Heading title="Thêm một sản phẩm " center/>
    <Input id="name" label="Tên" disabled={isLoading} 
    register={register}
    errors={errors}
    required />
    <Input id="price" label="Giá" disabled={isLoading} 
    register={register}
    errors={errors}
    type="number"
    required />
    <Input id="brand" label="Thương hiệu" disabled={isLoading} 
    register={register}
    errors={errors}
    required />
    <TextArea id="description" label="Mô tả" disabled={isLoading} 
    register={register}
    errors={errors}
    required />
    <CustomCheckBox id="inStock"register={register} label="Sản phẩm này còn trong kho"/>

    <div className="w-full font-medium ">
        <div className="mb-2 font-semibold">Chọn một danh mục</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h[50vh] overflow-y-auto">
            {
            categories.map((item)=>{
                if(item.label=='All'){
                    return null;
                }
                return <div key={item.label} className="col-span"><CategoryInput onClick={(category)=>setCustomValue("category",category)}
                selected={category==item.label}
                label={item.label}
                icon={item.icon}
                /></div>
            })
            }</div>
         </div>
         <div className="w-full flex flex-col flex-wrap gap-4">
            <div>
                <div className="font-bold">
                Chọn màu sắc sản phẩm có sẵn và tải lên hình ảnh của chúng
                </div>
                <div className="font-bold">Vui lòng chọn và tải ảnh lên </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {colors.map((item,index)=>{
                return( <SelectColor key={index} item ={item}
                     addImageToState={addImageToState}
                    removeImageFromState={removeImageFromState} 
                    isProductCreated={isProductCreated}  
                />)
            })}</div>
         </div>
         <Button label={isLoading?'Đang tải...':'Thêm sản phẩm'}onClick={handleSubmit(onSubmit)}/>
 </>
    );
}
 
export default AddProductForm;