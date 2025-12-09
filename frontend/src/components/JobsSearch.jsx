import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import JobSearchBar from './JobSearchBar'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const JobsSearch = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                const query = searchedQuery.toLowerCase();
                return job.title.toLowerCase().includes(query) ||
                    job.description.toLowerCase().includes(query) ||
                    job.location.toLowerCase().includes(query) ||
                    job.company?.name?.toLowerCase().includes(query) ||
                    (job.requirements && job.requirements.some(req => req.toLowerCase().includes(query)))
            })
            setFilterJobs(filteredJobs)
        } else {
            setFilterJobs(allJobs)
        }
    }, [allJobs, searchedQuery]);

    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto mt-5 px-4'>
                {/* Search Bar */}
                <div className='mb-6'>
                    <JobSearchBar />
                </div>

                {/* Results */}
                <div className='mb-4'>
                    <h2 className='text-xl font-semibold text-gray-800'>
                        {searchedQuery ? `Search Results for "${searchedQuery}"` : 'All Jobs'}
                    </h2>
                    <p className='text-gray-600 mt-1'>
                        {filterJobs.length} job{filterJobs.length !== 1 ? 's' : ''} found
                    </p>
                </div>

                {
                    filterJobs.length <= 0 ? (
                        <div className='text-center py-12'>
                            <div className='text-gray-400 mb-4'>
                                <svg className='mx-auto h-12 w-12' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                </svg>
                            </div>
                            <h3 className='text-lg font-medium text-gray-900 mb-2'>No jobs found</h3>
                            <p className='text-gray-600'>Try adjusting your search criteria or browse all jobs.</p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {
                                filterJobs.map((job) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        key={job?._id}>
                                        <Job job={job} />
                                    </motion.div>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default JobsSearch
