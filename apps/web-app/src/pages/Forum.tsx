import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { Topic, Question } from '../types';
import { MessageSquare, ArrowRight, Plus } from 'lucide-react';
import { CreateQuestionModal } from '../components/CreateQuestionModal';
import { showToast } from '../components/Toast';

const Forum = () => {
    const navigate = useNavigate();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
    const [showQuestionModal, setShowQuestionModal] = useState(false);

    const fetchData = async () => {
        try {
            const [topicsData, questionsData] = await Promise.all([
                apiClient.getTopics(),
                apiClient.getQuestions(),
            ]);
            setTopics(topicsData);
            setQuestions(questionsData);
        } catch (error) {
            console.error('Error fetching forum data:', error);
            showToast('Failed to load forum data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleQuestionCreated = () => {
        showToast('Question posted successfully!', 'success');
        fetchData();
    };

    const filteredQuestions = selectedTopicId
        ? questions.filter(q => q.topicId === selectedTopicId)
        : questions;

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Forum</h1>
                    <p className="text-gray-500 mt-1">Ask questions and share knowledge with the community</p>
                </div>
                <button
                    onClick={() => setShowQuestionModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Ask Question
                </button>
            </div>

            <CreateQuestionModal
                isOpen={showQuestionModal}
                onClose={() => setShowQuestionModal(false)}
                topicId={selectedTopicId || undefined}
                topics={topics}
                onQuestionCreated={handleQuestionCreated}
            />

            {/* Topics Grid */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Topics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topics.map((topic) => (
                        <div
                            key={topic.id}
                            onClick={() => setSelectedTopicId(selectedTopicId === topic.id ? null : topic.id)}
                            className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${selectedTopicId === topic.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{topic.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{topic.description}</p>
                                </div>
                                <MessageSquare className="text-blue-600 w-6 h-6" />
                            </div>
                            <div className="mt-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {questions.filter(q => q.topicId === topic.id).length} questions
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Questions List */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {selectedTopicId ? 'Filtered Questions' : 'Recent Questions'}
                </h2>
                <div className="space-y-3">
                    {filteredQuestions.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No questions found</p>
                    ) : (
                        filteredQuestions.map((question) => (
                            <div
                                key={question.id}
                                onClick={() => navigate(`/forum/questions/${question.id}`)}
                                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {question.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                            <span>{question.askedBy?.name}</span>
                                            <span>•</span>
                                            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                                            <MessageSquare size={12} />
                                            {question._count?.answers || 0}
                                        </span>
                                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Forum;
