import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const Signup = () => {

    const schema = yup.object().shape({
        fullname: yup.string().required('Full name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        phoneNumber: yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        role: yup.string().oneOf(['student', 'recruiter'], 'Invalid role').required('Role is required'),
        file: yup.mixed().required('Profile photo is required'),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const {loading,user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const onSubmit = async (data) => {
        const formData = new FormData();    //formdata object
        formData.append("fullname", data.fullname);
        formData.append("email", data.email);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("password", data.password);
        formData.append("role", data.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally{
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])
    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={handleSubmit(onSubmit)} className='w-3/5 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            {...register('fullname')}
                            placeholder="Enter your full name"
                        />
                        <span className='text-red-500'>{errors.fullname?.message}</span>
                    </div>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            {...register('email')}
                            placeholder="Enter your email"
                        />
                        <span className='text-red-500'>{errors.email?.message}</span>
                    </div>
                    <div className='my-2'>
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            {...register('phoneNumber')}
                            placeholder="Enter your phone number"
                        />
                        <span className='text-red-500'>{errors.phoneNumber?.message}</span>
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            {...register('password')}
                            placeholder="Enter your password"
                        />
                        <span className='text-red-500'>{errors.password?.message}</span>
                    </div>
                    <div className='my-5'>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        value="student"
                                        {...register('role')}
                                        className="cursor-pointer"
                                    />
                                    <Label htmlFor="r1">Student</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        value="recruiter"
                                        {...register('role')}
                                        className="cursor-pointer"
                                    />
                                    <Label htmlFor="r2">Recruiter</Label>
                                </div>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <Label>Profile </Label>
                                <Input
                                    accept="image/*"
                                    type="file"
                                    {...register('file')}
                                    onChange={(e) => {
                                        changeFileHandler(e);
                                        register('file').onChange(e);
                                    }}
                                    className="cursor-pointer"
                                    required
                                />
                            </div>
                        </div>
                        {errors.role && <span className='text-red-500 text-sm mt-2'>{errors.role.message}</span>}
                        {errors.file && <span className='text-red-500 text-sm mt-2'>{errors.file.message}</span>}
                    </div>
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Signup</Button>
                    }
                    <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Signup