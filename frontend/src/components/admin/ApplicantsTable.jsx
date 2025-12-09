import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { motion } from "framer-motion";
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useState } from 'react';
const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const [loadingResume, setLoadingResume] = useState(null);

    const statusHandler = async (status, id) => {
        console.log('called');
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            console.log(res);
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const handleResumePreview = async (resumeUrl, applicantId) => {
        try {
            console.log('Resume URL:', resumeUrl);
            setLoadingResume(applicantId);
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/resume-url`, { resumeUrl });
            console.log('API Response:', res.data);
            if (res.data.success) {
                console.log('Opening URL:', res.data.signedUrl);
                window.open(res.data.signedUrl, '_blank', 'noopener,noreferrer');
            } else {
                toast.error('Failed to generate resume preview URL');
            }
        } catch (error) {
            console.error('Error generating resume URL:', error);
            console.error('Error response:', error.response);
            toast.error('Failed to open resume preview');
        } finally {
            setLoadingResume(null);
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicants && applicants?.applications?.map((item) => (
                    <motion.tr
                        initial={{ x: -100 }}
                        animate={{ x: 0 }}
                        exit={{ x: -100 }}
                        transition={{ duration: 0.5 }}
                        key={item?._id}>
                        <TableCell>{item?.applicant?.fullname}</TableCell>
                        <TableCell>{item?.applicant?.email}</TableCell>
                        <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                        <TableCell className="text-blue-600 cursor-pointer">
                            <span
                                onClick={() => handleResumePreview(item?.applicant?.profile?.resume, item?.applicant?._id)}
                                className={`${loadingResume === item?.applicant?._id ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
                            >
                                {loadingResume === item?.applicant?._id ? 'Loading...' : item?.applicant?.profile?.resumeOriginalName}
                            </span>
                        </TableCell>
                        <TableCell>{item?.createdAt?.split("T")[0]}</TableCell>
                        <TableCell className="float-right cursor-pointer">
                            <Popover>
                                <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                <PopoverContent className="w-32">
                                    {
                                        shortlistingStatus.map((sts, idx) => {
                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() => statusHandler(sts, item?._id)}
                                                    className="flex w-fit items-center gap-2 my-2 cursor-pointer">
                                                    <span>{sts}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </PopoverContent>
                            </Popover>
                        </TableCell>
                    </motion.tr>
                ))}

                </TableBody>

            </Table>
        </div>
    )
}

export default ApplicantsTable
