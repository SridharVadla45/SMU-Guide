import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { MentorProfile } from '../types';
import { Role } from '../types';
import { Search, Filter } from 'lucide-react';

const Mentors = () => {
    const navigate = useNavigate();
    const [mentors, setMentors] = useState<MentorProfile[]>([]);
    const [filteredMentors, setFilteredMentors] = useState<MentorProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<'ALL' | 'ALUMNI' | 'PROFESSOR'>('ALL');
    const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const data = await apiClient.getMentorProfiles();
                setMentors(data);
                setFilteredMentors(data);
            } catch (error) {
                console.error('Error fetching mentors:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMentors();
    }, []);

    useEffect(() => {
        let result = mentors;

        // Filter by Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (m) =>
                    m.user?.name.toLowerCase().includes(query) ||
                    m.user?.department?.toLowerCase().includes(query) ||
                    m.currentCompany?.toLowerCase().includes(query) ||
                    m.currentRole?.toLowerCase().includes(query)
            );
        }

        // Filter by Role
        if (selectedRole !== 'ALL') {
            if (selectedRole === 'ALUMNI') {
                result = result.filter((m) => m.user?.role === Role.MENTOR);
            } else if (selectedRole === 'PROFESSOR') {
                result = result.filter((m) => m.user?.role === Role.PROFESSOR);
            }
        }

        // Filter by Department
        if (selectedDepartment !== 'All Departments') {
            result = result.filter((m) => m.user?.department === selectedDepartment);
        }

        setFilteredMentors(result);
    }, [searchQuery, selectedRole, selectedDepartment, mentors]);

    const departments = ['All Departments', ...Array.from(new Set(mentors.map((m) => m.user?.department).filter(Boolean)))];

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Find a Mentor</h1>
                <p className="text-gray-500 mt-1">Connect with experienced alumni and professors</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or keywords..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select
                            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                        >
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${selectedRole === 'ALL' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            onClick={() => setSelectedRole('ALL')}
                        >
                            All
                        </button>
                        <button
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${selectedRole === 'ALUMNI' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            onClick={() => setSelectedRole('ALUMNI')}
                        >
                            Alumni
                        </button>
                        <button
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${selectedRole === 'PROFESSOR' ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            onClick={() => setSelectedRole('PROFESSOR')}
                        >
                            Professors
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <p className="text-sm text-gray-500">{filteredMentors.length} mentors found</p>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map((profile) => (
                    <div key={profile.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <div className="flex items-start gap-4 mb-4">
                            <img
                                src={profile.user?.avatarUrl}
                                alt={profile.user?.name}
                                className="w-12 h-12 rounded-full object-cover border border-gray-100"
                            />
                            <div>
                                <h3 className="font-medium text-gray-900">{profile.user?.name}</h3>
                                <p className="text-xs text-gray-500">{profile.user?.department}</p>
                                <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full ${profile.user?.role === Role.PROFESSOR
                                    ? 'bg-purple-50 text-purple-700'
                                    : 'bg-blue-50 text-blue-700'
                                    }`}>
                                    {profile.user?.role === Role.PROFESSOR ? 'Professor' : 'Alumni'}
                                </span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-900">
                                {profile.currentRole}
                            </p>
                            <p className="text-sm text-gray-500">
                                {profile.currentCompany}
                            </p>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-6 flex-1">
                            {profile.bioExtended || profile.user?.bio}
                        </p>

                        <button
                            onClick={() => navigate(`/mentors/${profile.id}`)}
                            className="w-full py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            View Profile
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Mentors;
