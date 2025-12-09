import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const AdminJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { companies } = useSelector(store => store.company);

  const [input, setInput] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    jobType: '',
    experience: '',
    position: 1,
    companyId: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setFetching(true);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, { withCredentials: true });
        if (res.data.success) {
          const job = res.data.job;
          setInput({
            title: job.title || '',
            description: job.description || '',
            requirements: job.requirements ? job.requirements.join(',') : '',
            salary: job.salary || '',
            location: job.location || '',
            jobType: job.jobType || '',
            experience: job.experienceLevel || '',
            position: job.position || 1,
            companyId: job.company?._id || ''
          });
        } else {
          toast.error('Failed to fetch job details');
        }
      } catch (error) {
        toast.error('Error fetching job details');
      } finally {
        setFetching(false);
      }
    };
    fetchJob();
  }, [id]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find((company) => company._id === value);
    if (selectedCompany) {
      setInput({ ...input, companyId: selectedCompany._id });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (
      !input.title.trim() ||
      !input.description.trim() ||
      !input.requirements.trim() ||
      input.salary === '' ||
      isNaN(Number(input.salary)) ||
      Number(input.salary) <= 0 ||
      !input.location.trim() ||
      !input.jobType.trim() ||
      input.experience === '' ||
      isNaN(Number(input.experience)) ||
      Number(input.experience) < 0 ||
      input.position <= 0 ||
      !input.companyId
    ) {
      toast.error(
        'Please fill all fields correctly. Salary and experience must be positive numbers, position must be at least 1, and select a company.'
      );
      return;
    }
    try {
      setLoading(true);
      const res = await axios.put(
        `${JOB_API_END_POINT}/update/${id}`,
        {
          title: input.title,
          description: input.description,
          requirements: input.requirements,
          salary: input.salary,
          location: input.location,
          jobType: input.jobType,
          experience: input.experience,
          position: input.position,
          companyId: input.companyId
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/admin/jobs');
      } else {
        toast.error(res.data.message || 'Failed to update job');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating job');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form onSubmit={submitHandler} className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Salary</Label>
              <Input
                type="number"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Experience Level</Label>
              <Input
                type="number"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>No of Position</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Company</Label>
              {companies.length > 0 && (
                <Select onValueChange={selectChangeHandler} value={input.companyId}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem key={company._id} value={company._id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          {loading ? (
            <Button className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Update Job
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminJobDetail;
