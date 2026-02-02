import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getConfig() {
        try {
            console.log('Fetching analytics config...');
            const config = await this.prisma.analyticsConfig.findFirst({
                where: { isActive: true },
            });
            console.log('Found config:', config);

            if (!config) {
                console.log('Creating default analytics config...');
                // Create default config
                const newConfig = await this.prisma.analyticsConfig.create({
                    data: {
                        isActive: true,
                    },
                });
                console.log('Created new config:', newConfig);
                return newConfig;
            }

            return config;
        } catch (error) {
            console.error('Error in getConfig:', error);
            throw error;
        }
    }

    async updateConfig(data: any) {
        const config = await this.getConfig();

        return this.prisma.analyticsConfig.update({
            where: { id: config.id },
            data,
        });
    }

    async getDashboardMetrics() {
        // Mock data for now - will integrate with real analytics later
        return {
            pageViews: {
                today: 1234,
                yesterday: 1156,
                change: 6.7,
            },
            visitors: {
                today: 456,
                yesterday: 423,
                change: 7.8,
            },
            topPages: [
                { path: '/blog/getting-started', views: 234, visitors: 156 },
                { path: '/blog/advanced-tips', views: 189, visitors: 123 },
                { path: '/', views: 156, visitors: 98 },
            ],
            trafficSources: [
                { source: 'Organic Search', visitors: 234, percentage: 51.3 },
                { source: 'Direct', visitors: 123, percentage: 27.0 },
                { source: 'Social Media', visitors: 67, percentage: 14.7 },
                { source: 'Referral', visitors: 32, percentage: 7.0 },
            ],
            realTimeVisitors: 23,
        };
    }
}
