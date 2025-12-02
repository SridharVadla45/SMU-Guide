import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import type { Question, Answer } from '../types';
import { ArrowLeft, MessageSquare, Check } from 'lucide-react';

const QuestionDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [question, setQuestion] = useState<Question | null>(null);
    const [answerBody, setAnswerBody] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQuestion = async () => {
            if (!id) return;
            try {
                const data = await apiClient.getQuestionById(Number(id));
                setQuestion(data || null);
            } catch (error) {
                console.error('Error fetching question:', error);
                setError('Failed to load question');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [id]);

    const handleSubmitAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!answerBody.trim() || !id) return;

        setSubmitting(true);
        setError('');

        try {
            const newAnswer = await apiClient.createAnswer(Number(id), answerBody);
            setQuestion(prev => prev ? {
                ...prev,
                answers: [...(prev.answers || []), newAnswer]
            } : null);
            setAnswerBody('');
        } catch (err: any) {
            setError(err.message || 'Failed to submit answer');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    if (!question) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Question not found</p>
                <button
                    onClick={() => navigate('/forum')}
                    className="mt-4 text-blue-600 hover:text-blue-700"
                >
                    Back to Forum
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={() => navigate('/forum')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft size={20} />
                Back to Forum
            </button>

            {/* Question */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{question.title}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{question.askedBy?.name}</span>
                            <span>•</span>
                            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        <MessageSquare size={12} />
                        {question.answers?.length || 0} answers
                    </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{question.body}</p>
            </div>

            {/* Answers */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                    {question.answers?.length || 0} Answers
                </h2>

                {question.answers?.map((answer: Answer) => (
                    <div
                        key={answer.id}
                        className={`bg-white rounded-xl border p-6 shadow-sm ${answer.isAccepted ? 'border-green-200 bg-green-50/30' : 'border-gray-200'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <img
                                    src={answer.answeredBy?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${answer.answeredBy?.name}`}
                                    alt={answer.answeredBy?.name}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">{answer.answeredBy?.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(answer.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            {answer.isAccepted && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    <Check size={12} />
                                    Accepted
                                </span>
                            )}
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{answer.body}</p>
                    </div>
                ))}
            </div>

            {/* Answer Form */}
            {user && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmitAnswer}>
                        <textarea
                            value={answerBody}
                            onChange={(e) => setAnswerBody(e.target.value)}
                            placeholder="Write your answer here..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={6}
                            required
                        />
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting || !answerBody.trim()}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {submitting ? 'Submitting...' : 'Submit Answer'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default QuestionDetail;
