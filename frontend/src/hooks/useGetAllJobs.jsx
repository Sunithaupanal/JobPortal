import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);

    // Parse searchedQuery into jobTitleOrCompany, location, jobType
    // Assuming searchedQuery is a string like "data analytics bangalore Full-time"
    // We will try to extract jobType from known job types, location from known locations, and rest as jobTitleOrCompany

    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
    const locations = []; // Could import from filterConfigNoSalary or define here if needed

    // Simple parsing logic
    const parseSearchQuery = (query) => {
        let jobType = '';
        let location = '';
        let jobTitleOrCompany = query;

        jobTypes.forEach(type => {
            if (query.includes(type)) {
                jobType = type;
                jobTitleOrCompany = jobTitleOrCompany.replace(type, '').trim();
            }
        });

        // For location, since we don't have a list here, we can try to extract last word if it is not jobType
        // This is a simplistic approach and can be improved
        const words = jobTitleOrCompany.split(' ');
        if (words.length > 1) {
            const lastWord = words[words.length - 1];
            if (!jobTypes.includes(lastWord)) {
                location = lastWord;
                jobTitleOrCompany = words.slice(0, words.length - 1).join(' ');
            }
        }

        return { jobTitleOrCompany, location, jobType };
    };

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const { jobTitleOrCompany, location, jobType } = parseSearchQuery(searchedQuery);
                const params = new URLSearchParams();
                if (jobTitleOrCompany) params.append('jobTitleOrCompany', jobTitleOrCompany);
                if (location) params.append('location', location);
                if (jobType) params.append('jobType', jobType);

                const res = await axios.get(`${JOB_API_END_POINT}/get?${params.toString()}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllJobs();
    }, [searchedQuery, dispatch]);
};

export default useGetAllJobs
