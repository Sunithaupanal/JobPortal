// Dynamic filter configuration for job filters
// This makes it easy to modify filter options without changing component code
// Salary filter removed as requested

export const filterConfig = {
    location: {
        label: "Location",
        options: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    industry: {
        label: "Industry",
        options: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    skills: {
        label: "Skills",
        options: [
            "JavaScript", "React", "Node.js", "Python", "Java",
            "HTML", "CSS", "MongoDB", "Express", "SQL",
            "Git", "AWS", "Docker", "TypeScript", "Angular", "Vue.js"
        ]
    }
    // Salary filter removed as requested
};

// Helper function to get all filter data in the original format
export const getFilterData = () => {
    return Object.entries(filterConfig).map(([key, config]) => ({
        fitlerType: config.label,
        array: config.options
    }));
};

// Helper function to get skills only
export const getSkills = () => filterConfig.skills.options;

// Helper function to get locations only
export const getLocations = () => filterConfig.location.options;

// Helper function to get industries only
export const getIndustries = () => filterConfig.industry.options;

// Helper function to get salary ranges only - REMOVED
// export const getSalaryRanges = () => filterConfig.salary.options;
