import { useState } from 'react';

export default function Settings() {
    // --- Navigation State ---
    const [activeTab, setActiveTab] = useState('General');

    // --- Tab 1: General State ---
    const [defaultAccount, setDefaultAccount] = useState('Real');
    const [payWithFty, setPayWithFty] = useState(true);
    const [oneClickTrade, setOneClickTrade] = useState(false);
    const [theme, setTheme] = useState('System');

    // --- Tab 2: Security State ---
    const [whitelistEnabled, setWhitelistEnabled] = useState(false);

    // --- Tab 4: Notifications State ---
    const [emailOrders, setEmailOrders] = useState(true);
    const [emailSecurity, setEmailSecurity] = useState(true);
    const [pushPriceAlerts, setPushPriceAlerts] = useState(true);
    const [pushPromotions, setPushPromotions] = useState(false);

    // Sidebar Menu Items
    const menuItems = [
        { id: 'General', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
        { id: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z' },
        { id: 'API', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
        { id: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' }
    ];

    // Helper component for identical toggle switches
    const Toggle = ({ active, onClick }) => (
        <button onClick={onClick} className={`w-12 h-6 rounded-full relative shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${active ? 'bg-emerald-500' : 'bg-slate-300'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${active ? 'translate-x-7' : 'translate-x-1'}`}></div>
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 antialiased py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
            <div className="max-w-7xl mx-auto">
                
                {/* --- Page Header --- */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Settings</h1>
                    <p className="mt-2 text-sm font-medium text-slate-500">Manage your general preferences, security vectors, and API connections.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* --- Sidebar Navigation --- */}
                    <aside className="lg:w-64 shrink-0">
                        <nav className="flex flex-col gap-1 sticky top-8">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                                        activeTab === item.id 
                                            ? 'bg-white shadow-sm border border-slate-200 text-indigo-600' 
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                                    }`}
                                >
                                    <svg className={`w-5 h-5 ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                    {item.id === 'API' ? 'API Management' : item.id}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* --- Main Content Area --- */}
                    <main className="flex-1 space-y-6 pb-20">
                        
                        {/* ========================================= */}
                        {/* TAB 1: GENERAL SETTINGS                   */}
                        {/* ========================================= */}
                        {activeTab === 'General' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                
                                {/* Trading Preferences */}
                                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                                    <div className="px-6 py-5 border-b border-slate-100">
                                        <h3 className="text-lg font-black text-slate-900">Trading Preferences</h3>
                                    </div>
                                    <div className="p-6 space-y-8">
                                        
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">Default Startup Environment</h4>
                                                <p className="text-xs font-medium text-slate-500 mt-1">Choose which account loads first.</p>
                                            </div>
                                            <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                                                <button onClick={() => setDefaultAccount('Real')} className={`px-5 py-2 text-xs font-black rounded-lg transition-all ${defaultAccount === 'Real' ? 'bg-white shadow-sm text-indigo-600 border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>Real Trading</button>
                                                <button onClick={() => setDefaultAccount('Paper')} className={`px-5 py-2 text-xs font-black rounded-lg transition-all ${defaultAccount === 'Paper' ? 'bg-white shadow-sm text-indigo-600 border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>Paper Trading</button>
                                            </div>
                                        </div>

                                        <div className="h-px w-full bg-slate-100"></div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">Pay Fees in Fantasy (FTY) <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-md">Save 25%</span></h4>
                                                <p className="text-xs font-medium text-slate-500 mt-1">Deduct trading fees from your FTY balance automatically.</p>
                                            </div>
                                            <Toggle active={payWithFty} onClick={() => setPayWithFty(!payWithFty)} />
                                        </div>

                                        <div className="h-px w-full bg-slate-100"></div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 text-rose-600">One-Click Trading</h4>
                                                <p className="text-xs font-medium text-slate-500 mt-1">Disable confirmation modals for Limit and Market orders. <span className="font-bold text-slate-700">High risk.</span></p>
                                            </div>
                                            <Toggle active={oneClickTrade} onClick={() => setOneClickTrade(!oneClickTrade)} />
                                        </div>

                                    </div>
                                </div>

                                {/* Display & Region */}
                                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                                    <div className="px-6 py-5 border-b border-slate-100">
                                        <h3 className="text-lg font-black text-slate-900">Display & Region</h3>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Theme</label>
                                                <div className="relative">
                                                    <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600">
                                                        <option value="System">System Default</option>
                                                        <option value="Light">Light Mode</option>
                                                        <option value="Dark">Dark Mode</option>
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg></div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Timezone</label>
                                                <div className="relative">
                                                    <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600">
                                                        <option value="IST">(UTC+05:30) Indian Standard Time</option>
                                                        <option value="UTC">(UTC+00:00) Coordinated Universal Time</option>
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg></div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Base Currency</label>
                                                <div className="relative">
                                                    <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600">
                                                        <option value="INR">INR - Indian Rupee (₹)</option>
                                                        <option value="USD">USD - US Dollar ($)</option>
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg></div>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="bg-white border border-rose-200 rounded-[2rem] shadow-sm overflow-hidden p-6 flex justify-between items-center gap-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Deactivate Account</h4>
                                        <p className="text-xs font-medium text-slate-500 mt-1">Orders canceled, APIs deleted. Funds must be withdrawn first.</p>
                                    </div>
                                    <button className="shrink-0 px-6 py-3 bg-white border-2 border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-50 transition-colors active:scale-95">Deactivate</button>
                                </div>
                            </div>
                        )}

                        {/* ========================================= */}
                        {/* TAB 2: SECURITY & DEVICES                 */}
                        {/* ========================================= */}
                        {activeTab === 'Security' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                
                                {/* 2FA & Passwords */}
                                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                                        <h3 className="text-lg font-black text-slate-900">Authentication</h3>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-3">
                                                    Two-Factor Authentication (2FA)
                                                    <span className="bg-rose-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-rose-600 border border-rose-100 rounded-md">Disabled</span>
                                                </h3>
                                                <p className="mt-1 text-xs font-medium text-slate-500">Require an authenticator code when withdrawing funds or logging in.</p>
                                            </div>
                                            <button className="shrink-0 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-600 transition-all">Enable 2FA</button>
                                        </div>
                                        
                                        <div className="h-px w-full bg-slate-100"></div>
                                        
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
                                                <p className="mt-1 text-xs font-medium text-slate-500">Last changed 45 days ago.</p>
                                            </div>
                                            <button className="shrink-0 rounded-xl bg-white border border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">Update Password</button>
                                        </div>

                                        <div className="h-px w-full bg-slate-100"></div>

                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900">Anti-Phishing Code</h3>
                                                <p className="mt-1 text-xs font-medium text-slate-500">Add a unique code to all official emails from Fantasy Exchange.</p>
                                            </div>
                                            <button className="shrink-0 rounded-xl bg-white border border-slate-200 px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">Set Code</button>
                                        </div>

                                    </div>
                                </div>

                                {/* Asset Protection */}
                                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">Withdrawal Whitelist</h3>
                                        <p className="mt-1 text-xs font-medium text-slate-500">When enabled, withdrawals are only permitted to pre-saved, verified wallet addresses.</p>
                                    </div>
                                    <Toggle active={whitelistEnabled} onClick={() => setWhitelistEnabled(!whitelistEnabled)} />
                                </div>

                                {/* Device Management */}
                                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                                    <div className="px-6 py-5 border-b border-slate-100">
                                        <h3 className="text-lg font-black text-slate-900">Device Management</h3>
                                    </div>
                                    <div className="p-6 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 flex items-center gap-2">MacBook Pro <span className="text-[10px] bg-emerald-100 text-emerald-700 uppercase tracking-widest px-2 py-0.5 rounded-md border border-emerald-200">Current</span></p>
                                                <p className="text-xs font-medium text-slate-500 mt-1">Mumbai, India • Active now</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ========================================= */}
                        {/* TAB 3: API MANAGEMENT                     */}
                        {/* ========================================= */}
                        {activeTab === 'API' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                
                                {/* Header / Create Action */}
                                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900">API Keys</h3>
                                        <p className="mt-1 text-sm font-medium text-slate-500">Connect automated bots or external portfolio trackers.</p>
                                    </div>
                                    <button className="shrink-0 px-6 py-3 bg-indigo-600 text-white font-black rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                        Generate New Key
                                    </button>
                                </div>

                                {/* Active Keys List */}
                                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <h4 className="text-sm font-bold text-slate-900">TradingBot_Alpha_1</h4>
                                    </div>
                                    <div className="p-6 flex flex-col sm:flex-row justify-between gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Permissions</p>
                                                <div className="flex gap-2 mt-1.5">
                                                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold">Read Info</span>
                                                    <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold">Enable Trading</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">IP Restrictions</p>
                                                <p className="text-sm font-bold text-slate-900 mt-1">Restricted to 1 IP Address</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 shrink-0">
                                            <button className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors">Edit Restrictions</button>
                                            <button className="px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded-lg transition-colors">Delete Key</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}

                        {/* ========================================= */}
                        {/* TAB 4: NOTIFICATIONS                      */}
                        {/* ========================================= */}
                        {activeTab === 'Notifications' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                
                                {/* Email Alerts */}
                                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                                    <div className="px-6 py-5 border-b border-slate-100">
                                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            Email Alerts
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-8">
                                        <div className="flex justify-between items-center gap-4">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">Order Executions</h4>
                                                <p className="text-xs font-medium text-slate-500 mt-1">Get an email when your Limit or Agentic orders are filled.</p>
                                            </div>
                                            <Toggle active={emailOrders} onClick={() => setEmailOrders(!emailOrders)} />
                                        </div>
                                        <div className="h-px w-full bg-slate-100"></div>
                                        <div className="flex justify-between items-center gap-4">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">Security Alerts</h4>
                                                <p className="text-xs font-medium text-slate-500 mt-1">Emails for new logins and withdrawal requests. <span className="text-slate-400 italic">(Mandatory)</span></p>
                                            </div>
                                            <Toggle active={true} onClick={() => {}} /> {/* Hardcoded true for realism */}
                                        </div>
                                    </div>
                                </div>

                                {/* Push/System Alerts */}
                                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
                                    <div className="px-6 py-5 border-b border-slate-100">
                                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                            System & App Notifications
                                        </h3>
                                    </div>
                                    <div className="p-6 space-y-8">
                                        <div className="flex justify-between items-center gap-4">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">Price Alerts</h4>
                                                <p className="text-xs font-medium text-slate-500 mt-1">Notify me when assets on my watchlist move significantly (+/- 5%).</p>
                                            </div>
                                            <Toggle active={pushPriceAlerts} onClick={() => setPushPriceAlerts(!pushPriceAlerts)} />
                                        </div>
                                        <div className="h-px w-full bg-slate-100"></div>
                                        <div className="flex justify-between items-center gap-4">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">Promotions & News</h4>
                                                <p className="text-xs font-medium text-slate-500 mt-1">Receive updates about new listings, features, and fee discounts.</p>
                                            </div>
                                            <Toggle active={pushPromotions} onClick={() => setPushPromotions(!pushPromotions)} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}

                    </main>

                </div>
            </div>
        </div>
    );
}