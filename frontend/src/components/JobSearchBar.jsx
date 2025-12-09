import React, { useState } from 'react'
import { Search, MapPin, ChevronDown } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { getLocations, getIndustries } from '../utils/filterConfigNoSalary'

const JobSearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedLocation, setSelectedLocation] = useState('')
    const [selectedJobType, setSelectedJobType] = useState('All Job Types')
    const [showLocationDropdown, setShowLocationDropdown] = useState(false)
    const [showJobTypeDropdown, setShowJobTypeDropdown] = useState(false)

    const dispatch = useDispatch()

    const locations = getLocations()
    const jobTypes = ['All Job Types', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']

    const handleSearch = () => {
        // Dispatch search parameters separately as an object stringified
        const searchParams = {
            jobTitleOrCompany: searchTerm,
            location: selectedLocation,
            jobType: selectedJobType && selectedJobType !== 'All Job Types' ? selectedJobType : ''
        };
        dispatch(setSearchedQuery(JSON.stringify(searchParams)));
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const handleLocationSelect = (location) => {
        setSelectedLocation(location)
        setShowLocationDropdown(false)
    }

    const handleJobTypeSelect = (jobType) => {
        setSelectedJobType(jobType)
        setShowJobTypeDropdown(false)
    }

    return (
        <div className='w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
            <div className='flex flex-col md:flex-row gap-3'>
                {/* Search Input */}
                <div className='flex-1 relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
                    <input
                        type='text'
                        placeholder='Job title or company'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                </div>

                {/* Location Dropdown */}
                <div className='relative'>
                    <div
                        className='flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 min-w-[150px]'
                        onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                    >
                        <MapPin className='text-gray-400 h-5 w-5' />
                        <span className='text-gray-700'>
                            {selectedLocation || 'Location'}
                        </span>
                        <ChevronDown className='text-gray-400 h-4 w-4 ml-auto' />
                    </div>

                    {showLocationDropdown && (
                        <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto'>
                            {locations.map((location, index) => (
                                <div
                                    key={index}
                                    className='px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700'
                                    onClick={() => handleLocationSelect(location)}
                                >
                                    {location}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Job Type Dropdown */}
                <div className='relative'>
                    <div
                        className='flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 min-w-[150px]'
                        onClick={() => setShowJobTypeDropdown(!showJobTypeDropdown)}
                    >
                        <span className='text-gray-700'>{selectedJobType}</span>
                        <ChevronDown className='text-gray-400 h-4 w-4 ml-auto' />
                    </div>

                    {showJobTypeDropdown && (
                        <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10'>
                            {jobTypes.map((jobType, index) => (
                                <div
                                    key={index}
                                    className='px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700'
                                    onClick={() => handleJobTypeSelect(jobType)}
                                >
                                    {jobType}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className='px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2'
                >
                    <Search className='h-5 w-5' />
                    Search
                </button>
            </div>

            {/* Click outside to close dropdowns */}
            {(showLocationDropdown || showJobTypeDropdown) && (
                <div
                    className='fixed inset-0 z-0'
                    onClick={() => {
                        setShowLocationDropdown(false)
                        setShowJobTypeDropdown(false)
                    }}
                />
            )}
        </div>
    )
}

export default JobSearchBar
