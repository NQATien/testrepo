'use client';

import { useEffect, useState } from "react";
import Heading from "../ components/Heading";
import Input from "../ components/inputs/Input";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import Button from "../ components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // Sửa đường dẫn đến useRouter
import { SafeUser } from "@/types";

interface LoginFormProps{
  currentUser:SafeUser|null
}
const LoginForm:React.FC<LoginFormProps> = ({currentUser}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  useEffect(()=>{if(currentUser){router.push('/cart');
  router.refresh();
}},[]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    signIn('credentials', {
      ...data,
      redirect: false, 
    }).then((callback) => { 
      setIsLoading(false);

      if (callback?.ok) {
        router.push("/cart");
        router.refresh();
        toast.success('Đăng nhập');
      }
      if (callback?.error) {
        toast.error(callback.error);
      }
    });
  };
if(currentUser)
{
  return<p className="text-center">Đã đăng nhập .Chuyển hướng...</p>
}
  return (
    <>
      <Heading title="Đăng nhập thành viên LuxeGlobal" />
      <Button
        outline
        label="Tiếp tục đăng nhập với Google"
        icon={AiOutlineGoogle}
        onClick={() => {signIn('google') }}
      />
      <hr className="bg-slate-300 w-full h-px" />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password" 
        label="Mật khẩu"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
      />
      <Button label={isLoading ? "Loading" : 'Đăng nhập'} onClick={handleSubmit(onSubmit)} />
      <p className="text-sm">Bạn chưa có tài khoản?{" "} <Link className="underline" href='/register'>Đăng ký</Link></p>
    </>
  );
};

export default LoginForm;
