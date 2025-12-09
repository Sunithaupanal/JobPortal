import React, { useState } from 'react'
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '../redux/jobSlice'

const jobTypes = ['All', 'Full-time', 'Part-time', 'Internship', 'Remote']

const FilterCard = () => {
  const [jobTitleOrCompany, setJobTitleOrCompany] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('All')

  const dispatch = useDispatch()

  const handleSearch = () => {
    // Create search query object
    const searchQuery = {
      jobTitleOrCompany: jobTitleOrCompany.trim(),
      location: location.trim(),
      jobType: jobType === 'All' ? '' : jobType
    }

    // Dispatch search query to Redux store
    dispatch(setSearchedQuery(JSON.stringify(searchQuery)))
  }

  return (
    <div className="w-full bg-white p-4 rounded-md shadow-md flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
      {/* Job title or company input */}
      <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 flex-1">
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Job title or company"
          value={jobTitleOrCompany}
          onChange={(e) => setJobTitleOrCompany(e.target.value)}
          className="bg-transparent outline-none w-full text-gray-700"
        />
      </div>

      {/* Location input */}
      <div className="flex items-center bg-gray-100 rounded-md px-3 py-2 flex-1">
        <FaMapMarkerAlt className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-transparent outline-none w-full text-gray-700"
        />
      </div>

      {/* Job type dropdown */}
      <div className="bg-gray-100 rounded-md px-3 py-2 flex-1">
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="w-full bg-transparent outline-none text-gray-700"
        >
          {jobTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white rounded-md px-5 py-2 hover:bg-blue-700 transition-colors"
      >
        Search
      </button>
    </div>
  )
}

export default FilterCard
