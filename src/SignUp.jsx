import React, { useState, useEffect } from 'react';
import { MagicCard } from './components/ui/magic-card';
import { User, Lock, Eye, EyeOff, MapPin, Map, Home, Mail, Phone, Calendar } from 'lucide-react';

const SignUp = ({ onNavigate }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirm_password: '',
        birthday: '',
        age: '',
        contact_number: '',
        province: '',
        city: '',
        barangay: '',
        street: '',
        zip_code: ''
    });

    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    // Fetch Provinces on load
    useEffect(() => {
        fetch('https://psgc.gitlab.io/api/provinces/')
            .then(res => res.json())
            .then(data => {
                data.sort((a, b) => a.name.localeCompare(b.name));
                setProvinces(data);
            })
            .catch(err => console.error("Error fetching provinces", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'birthday') {
            calculateAge(value);
        }
    };

    const calculateAge = (birthDateString) => {
        const birthDate = new Date(birthDateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        setFormData(prev => ({ ...prev, age: age >= 0 ? age : 0 }));
    };

    const handleProvinceChange = (e) => {
        const provinceName = e.target.value;
        const province = provinces.find(p => p.name === provinceName);

        setFormData(prev => ({ ...prev, province: provinceName, city: '', barangay: '' }));
        setCities([]);
        setBarangays([]);

        if (province) {
            fetch(`https://psgc.gitlab.io/api/provinces/${province.code}/cities-municipalities/`)
                .then(res => res.json())
                .then(data => {
                    data.sort((a, b) => a.name.localeCompare(b.name));
                    setCities(data);
                });
        }
    };

    const handleCityChange = (e) => {
        const cityName = e.target.value;
        const city = cities.find(c => c.name === cityName);

        setFormData(prev => ({ ...prev, city: cityName, barangay: '' }));
        setBarangays([]);

        if (city) {
            fetch(`https://psgc.gitlab.io/api/cities-municipalities/${city.code}/barangays/`)
                .then(res => res.json())
                .then(data => {
                    data.sort((a, b) => a.name.localeCompare(b.name));
                    setBarangays(data);
                });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        setLoading(true);

        // Frontend validation for contact number
        if (!/^09\d{9}$/.test(formData.contact_number)) {
            setError("Contact number must be 11 digits and start with 09.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost/ecopulse/api/register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                // Redirect or swtich view
                setTimeout(() => onNavigate('login'), 2000);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#132f48] p-4 font-sans text-white">
            <div className="fixed inset-0 z-0 bg-[linear-gradient(135deg,#204f79_0%,#132f48_50%,#0d2133_100%)] bg-[size:400%_400%] animate-gradient"></div>

            <MagicCard className="w-full max-w-4xl relative z-10 p-8 shadow-2xl border border-white/20 backdrop-blur-xl bg-white/10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Join EcoPulse</h2>
                    <p className="text-blue-200">Create your account to get started</p>
                </div>

                {message && <div className="bg-green-500/20 text-green-200 p-3 rounded mb-4 border border-green-500/30 text-center">{message}</div>}
                {error && <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 border border-red-500/30 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Column 1: Account Info */}
                    <div className="space-y-4">
                        <div className="text-xs uppercase tracking-wider text-blue-300 border-b border-white/10 pb-1 mb-2">Account Details</div>

                        <div className="space-y-1">
                            <label className="text-sm text-gray-300">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input type="text" name="username" value={formData.username} onChange={handleChange} required
                                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                                    placeholder="Username" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-gray-300">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required
                                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                                    placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-white">
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-gray-300">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input type={showConfirmPassword ? "text" : "password"} name="confirm_password" value={formData.confirm_password} onChange={handleChange} required
                                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                                    placeholder="••••••••" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-white">
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Personal Info */}
                    <div className="space-y-4">
                        <div className="text-xs uppercase tracking-wider text-blue-300 border-b border-white/10 pb-1 mb-2">Personal Info</div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm text-gray-300">Birthday</label>
                                <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} required
                                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm text-gray-300">Age</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-gray-300">Contact Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input type="tel" name="contact_number" value={formData.contact_number} onChange={handleChange} required maxLength={11}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                                    placeholder="09123456789" />
                            </div>
                        </div>
                    </div>

                    {/* Full Width: Address */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="text-xs uppercase tracking-wider text-blue-300 border-b border-white/10 pb-1 mb-2">Address</div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm text-gray-300">Province</label>
                                <div className="relative">
                                    <Map className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <select name="province" value={formData.province} onChange={handleProvinceChange} required
                                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400/50 [&>option]:bg-slate-800">
                                        <option value="">Select Province</option>
                                        {provinces.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm text-gray-300">City / Municipality</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <select name="city" value={formData.city} onChange={handleCityChange} required disabled={!formData.province}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-white cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 [&>option]:bg-slate-800">
                                        <option value="">Select City</option>
                                        {cities.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-gray-300">Detailed Address (Street / House No.)</label>
                            <div className="relative">
                                <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input type="text" name="street" value={formData.street} onChange={handleChange} required
                                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                                    placeholder="House No., Street Name" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-sm text-gray-300">Barangay</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <select name="barangay" value={formData.barangay} onChange={handleChange} required disabled={!formData.city}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-white cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 [&>option]:bg-slate-800">
                                        <option value="">Select Barangay</option>
                                        {barangays.map(b => <option key={b.code} value={b.name}>{b.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm text-gray-300">Zip Code</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <input type="text" name="zip_code" value={formData.zip_code} onChange={handleChange} required
                                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
                                        placeholder="Zip Code" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 pt-4">
                        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Creating Account...' : 'REGISTER'}
                        </button>
                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-400">Already have an account? <button type="button" onClick={() => onNavigate('login')} className="text-blue-300 hover:text-white transition-colors font-semibold hover:underline">Log In</button></p>
                        </div>
                    </div>

                </form>
            </MagicCard>
        </div>
    );
};

export default SignUp;
