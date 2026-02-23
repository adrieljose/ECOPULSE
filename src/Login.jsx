import React, { useState } from 'react';
import { MagicCard } from './components/ui/magic-card';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

const Login = ({ onNavigate }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Note: In real prod with CORS + Sessions, simpler to post to same origin or use JWT.
            // For this hybrid setup, we'll try standard fetch.
            const response = await fetch('http://localhost/ecopulse/api/auth_login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.success) {
                // Redirect to PHP dashboard
                window.location.href = data.redirect;
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Login failed. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#132f48] p-4 font-sans text-white">
            <div className="fixed inset-0 z-0 bg-[linear-gradient(135deg,#204f79_0%,#132f48_50%,#0d2133_100%)] bg-[size:400%_400%] animate-gradient"></div>

            <MagicCard className="w-full max-w-md relative z-10 p-8 shadow-2xl border border-white/20 backdrop-blur-xl bg-white/10">
                <div className="text-center mb-8">
                    <img src="img/logo.png" alt="EcoPulse" className="h-16 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                    <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                    <p className="text-blue-200 text-sm mt-1">Sign in to continue to EcoPulse</p>
                </div>

                {error && <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 border border-red-500/30 text-center text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all font-light"
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all font-light"
                                placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors">
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center space-x-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500/50 bg-white/10" />
                            <span className="text-gray-400 group-hover:text-blue-300 transition-colors">Remember me</span>
                        </label>
                        <a href="http://localhost/ecopulse/forgot-password.php" className="text-gray-400 hover:text-white transition-colors">Forgot Password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing In...' : 'SIGN IN'}
                    </button>

                    <a href="index.php?guest=1" className="block w-full text-center border border-white/20 text-white/70 hover:bg-white/10 hover:text-white font-semibold py-2 px-6 rounded-xl transition-all text-sm">
                        Continue as Guest
                    </a>
                </form>

                <div className="text-center mt-6 pt-6 border-t border-white/10">
                    <p className="text-sm text-gray-400">
                        Don't have an account?{' '}
                        <button
                            onClick={() => onNavigate('signup')}
                            className="text-blue-300 hover:text-white transition-colors font-bold hover:underline"
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </MagicCard>
        </div>
    );
};

export default Login;
