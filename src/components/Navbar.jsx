import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-2xl font-bold text-primary tracking-tighter">
                    Video<span className="text-secondary">Sense</span>
                </Link>
            </div>
            <div className="flex-none gap-2">
                {!user ? (
                    <div className="flex gap-2">
                        <Link to="/login" className="btn btn-ghost">Login</Link>
                        <Link style={{color:"white", backgroundColor:"#422ad5"}} to="/register" className="btn btn-primary">Get Started</Link>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="btn btn-ghost">Dashboard</Link>
                        {user.role === 'admin' && (
                            <Link to="/users" className="btn btn-ghost">Users</Link>
                        )}
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-8">
                                    <span className="text-xl">{user?.email?.[0]?.toUpperCase() || 'U'}</span>
                                </div>
                            </div>
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                <li className="px-4 py-2 font-semibold">Role: {user.role}</li>
                                <li><button onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
