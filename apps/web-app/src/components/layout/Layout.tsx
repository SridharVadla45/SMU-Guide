import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Calendar,
    MessageSquare,
    MessageCircle,
    LogOut,
    GraduationCap,
} from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const SidebarItem = ({
    to,
    icon: Icon,
    label,
    isActive,
}: {
    to: string;
    icon: React.ElementType;
    label: string;
    isActive: boolean;
}) => {
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
        >
            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
            {label}
        </Link>
    );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/mentors', label: 'Mentors', icon: Users },
        { path: '/appointments', label: 'Appointments', icon: Calendar },
        { path: '/forum', label: 'Forum', icon: MessageSquare },
        { path: '/messages', label: 'Messages', icon: MessageCircle },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 flex flex-col">
                <div className="p-6 flex items-center gap-3 border-b border-gray-100">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                        <GraduationCap size={20} />
                    </div>
                    <span className="text-xl font-bold text-gray-900">SMU-Guide</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            to={item.path}
                            icon={item.icon}
                            label={item.label}
                            isActive={location.pathname === item.path}
                        />
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors w-full">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen flex flex-col">
                {/* Header */}
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div>
                        {/* Breadcrumbs or Page Title could go here */}
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-4 focus:outline-none"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900">Sridhar Vadla</p>
                                <p className="text-xs text-gray-500">Student</p>
                            </div>
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sridhar"
                                alt="Profile"
                                className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200"
                            />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/login"
                                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    Logout
                                </Link>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8 flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
