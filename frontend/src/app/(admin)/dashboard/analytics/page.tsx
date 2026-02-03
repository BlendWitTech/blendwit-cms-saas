'use client';

import { useState, useEffect } from 'react';
import { ChartBarIcon, ArrowTrendingUpIcon, UsersIcon, EyeIcon } from '@heroicons/react/24/outline';
import { apiRequest } from '@/lib/api';
import { useNotification } from '@/context/NotificationContext';

export default function AnalyticsPage() {
    const [config, setConfig] = useState({
        ga4MeasurementId: '',
        gscPropertyUrl: '',
        fbPixelId: '',
        isActive: true,
    });
    const [dashboard, setDashboard] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const { showToast } = useNotification();

    useEffect(() => {
        fetchConfig();
        fetchDashboard();
    }, []);

    const fetchConfig = async () => {
        try {
            const data = await apiRequest('/analytics/config');
            if (data) {
                setConfig(data);
            }
        } catch (error) {
            console.error('Failed to fetch analytics config', error);
        }
    };

    const fetchDashboard = async () => {
        try {
            const data = await apiRequest('/analytics/dashboard');
            setDashboard(data);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await apiRequest('/analytics/config', {
                method: 'POST',
                body: JSON.stringify(config),
            });
            showToast('Analytics settings saved successfully', 'success');
        } catch (error) {
            showToast('Failed to save analytics settings', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    Analytics <span className="text-blue-600">Dashboard</span>
                </h1>
                <p className="mt-2 text-sm text-slate-600 font-medium">
                    Track your site's performance and configure analytics integrations
                </p>
            </div>

            {/* Dashboard Metrics */}
            {dashboard && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Page Views"
                        value={dashboard.pageViews.today.toLocaleString()}
                        change={dashboard.pageViews.change}
                        icon={EyeIcon}
                        color="blue"
                    />
                    <MetricCard
                        title="Visitors"
                        value={dashboard.visitors.today.toLocaleString()}
                        change={dashboard.visitors.change}
                        icon={UsersIcon}
                        color="purple"
                    />
                    <MetricCard
                        title="Real-time"
                        value={dashboard.realTimeVisitors.toString()}
                        subtitle="Active now"
                        icon={ArrowTrendingUpIcon}
                        color="green"
                    />
                    <MetricCard
                        title="Top Page"
                        value={dashboard.topPages[0]?.views.toLocaleString() || '0'}
                        subtitle={dashboard.topPages[0]?.path || 'N/A'}
                        icon={ChartBarIcon}
                        color="amber"
                    />
                </div>
            )}

            {/* Configuration */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 mb-8">
                <h2 className="text-xl font-black text-slate-900 mb-6">Analytics Configuration</h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Google Analytics 4 Measurement ID
                        </label>
                        <input
                            type="text"
                            value={config.ga4MeasurementId || ''}
                            onChange={(e) => setConfig({ ...config, ga4MeasurementId: e.target.value })}
                            placeholder="G-XXXXXXXXXX"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:border-blue-600 transition-colors"
                        />
                        <p className="mt-2 text-xs text-slate-600 font-medium">
                            Find this in your Google Analytics property settings
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Google Search Console Property URL
                        </label>
                        <input
                            type="text"
                            value={config.gscPropertyUrl || ''}
                            onChange={(e) => setConfig({ ...config, gscPropertyUrl: e.target.value })}
                            placeholder="https://example.com"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:border-blue-600 transition-colors"
                        />
                        <p className="mt-2 text-xs text-slate-600 font-medium">
                            Your verified property URL in Google Search Console
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                            Facebook Pixel ID
                        </label>
                        <input
                            type="text"
                            value={config.fbPixelId || ''}
                            onChange={(e) => setConfig({ ...config, fbPixelId: e.target.value })}
                            placeholder="1234567890"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl font-mono text-sm focus:outline-none focus:border-blue-600 transition-colors"
                        />
                        <p className="mt-2 text-xs text-slate-600 font-medium">
                            Find this in your Facebook Events Manager
                        </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={config.isActive}
                            onChange={(e) => setConfig({ ...config, isActive: e.target.checked })}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                        />
                        <label htmlFor="isActive" className="text-sm font-bold text-slate-900">
                            Enable analytics tracking
                        </label>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </div>

            {/* Traffic Sources */}
            {dashboard && (
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-8">
                    <h2 className="text-xl font-black text-slate-900 mb-6">Traffic Sources</h2>
                    <div className="space-y-4">
                        {dashboard.trafficSources.map((source: any, index: number) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <span className="text-sm font-bold text-slate-900">{source.source}</span>
                                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-blue-600 h-full rounded-full transition-all"
                                            style={{ width: `${source.percentage}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="text-right ml-4">
                                    <div className="text-sm font-bold text-slate-900">{source.visitors}</div>
                                    <div className="text-xs text-slate-600 font-medium">{source.percentage}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function MetricCard({ title, value, change, subtitle, icon: Icon, color }: any) {
    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        purple: 'bg-purple-50 text-purple-600 border-purple-200',
        green: 'bg-green-50 text-green-600 border-green-200',
        amber: 'bg-amber-50 text-amber-600 border-amber-200',
    };

    return (
        <div className={`${colorClasses[color]} border-2 rounded-2xl p-6`}>
            <div className="flex items-start justify-between mb-4">
                <Icon className="h-8 w-8" />
                {change !== undefined && (
                    <span className={`text-xs font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                    </span>
                )}
            </div>
            <div className="text-3xl font-black mb-1">{value}</div>
            <div className="text-xs font-bold opacity-75">{subtitle || title}</div>
        </div>
    );
}
