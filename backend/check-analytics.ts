import { PrismaClient } from '@prisma/client';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const prisma = new PrismaClient();

async function check() {
    const c = await prisma.analyticsConfig.findFirst();
    if (!c) {
        console.log('NO CONFIG FOUND');
        return;
    }

    console.log('--- ANALYTICS FULL CONFIG ---');
    console.log('GA4_ID:', c.ga4MeasurementId);
    console.log('PROPERTY_ID:', c.ga4PropertyId);
    console.log('HAS_EMAIL:', !!c.serviceAccountEmail);

    const rawKey = c.privateKey || '';
    console.log('RAW_KEY_LENGTH:', rawKey.length);

    if (c.serviceAccountEmail && c.privateKey && c.ga4PropertyId) {
        console.log('\n--- ATTEMPTING LIVE FETCH ---');
        try {
            // Logic from analytics.service.ts
            let formattedKey = c.privateKey.trim();
            if (formattedKey.startsWith('"') && formattedKey.endsWith('"')) {
                formattedKey = formattedKey.slice(1, -1);
            }
            formattedKey = formattedKey.replace(/\\n/g, '\n');

            const header = '-----BEGIN PRIVATE KEY-----';
            const footer = '-----END PRIVATE KEY-----';
            if (!formattedKey.includes(header)) {
                formattedKey = `${header}\n${formattedKey}`;
            }
            if (!formattedKey.includes(footer)) {
                formattedKey = `${formattedKey}\n${footer}`;
            }

            console.log('FORMATTED_KEY_FIRST_LINE:', formattedKey.split('\n')[0]);
            console.log('FORMATTED_KEY_LINE_COUNT:', formattedKey.split('\n').length);

            const client = new BetaAnalyticsDataClient({
                credentials: {
                    client_email: c.serviceAccountEmail,
                    private_key: formattedKey,
                },
            });

            const [response] = await client.runRealtimeReport({
                property: `properties/${c.ga4PropertyId}`,
                metrics: [{ name: 'activeUsers' }],
            });

            console.log('REALTIME_USERS:', response.rows?.[0]?.metricValues?.[0]?.value || '0');
            console.log('FETCH_SUCCESS: TRUE');
        } catch (e: any) {
            console.error('FETCH_ERROR_MESSAGE:', e.message);
            console.error('FETCH_ERROR_STACK:', e.stack);
        }
    } else {
        console.log('INCOMPLETE CONFIG FOR LIVE FETCH');
    }
}

check().finally(() => prisma.$disconnect());
