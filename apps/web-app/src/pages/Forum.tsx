import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { Topic } from '../types';
import { MessageSquare, ArrowRight } from 'lucide-react';

const Forum = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const data = await apiClient.getTopics();
                setTopics(data);
            } catch (error) {
                console.error('Error fetching topics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Forum</h1>
                <p className="text-gray-500 mt-1">Ask questions and share knowledge with the community</p>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topics.map((topic) => (
                    <div
                        key={topic.id}
                        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {topic.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {topic.description}
                                </p>
                            </div>
                            <MessageSquare className="text-blue-600 w-6 h-6" />
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {topic._count?.questions || 0} questions
                            </span>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Forum;
