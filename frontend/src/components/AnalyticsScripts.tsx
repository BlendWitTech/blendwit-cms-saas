'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function AnalyticsScripts({ config }: { config?: any }) {
    const ga4Id = config?.ga4MeasurementId || config?.ga4Id || process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
    const fbPixelId = config?.fbPixelId || config?.fbId || process.env.NEXT_PUBLIC_FB_PIXEL_ID;
    const isActive = config?.isActive !== false; // Default to true if not explicitly false

    useEffect(() => {
        if (!isActive) return;

        // Initialize Facebook Pixel if ID is provided
        if (fbPixelId && typeof window !== 'undefined') {
            console.log(`[Analytics] Initializing Facebook Pixel: ${fbPixelId}`);
            (window as any).fbq = function (...args: any[]) {
                if ((window as any).fbq.callMethod) {
                    (window as any).fbq.callMethod.apply((window as any).fbq, args);
                } else {
                    (window as any).fbq.queue.push(args);
                }
            };

            if (!(window as any)._fbq) (window as any)._fbq = (window as any).fbq;
            (window as any).fbq.push = (window as any).fbq;
            (window as any).fbq.loaded = true;
            (window as any).fbq.version = '2.0';
            (window as any).fbq.queue = [];

            (window as any).fbq('init', fbPixelId);
            (window as any).fbq('track', 'PageView');
        }

        if (ga4Id) {
            console.log(`[Analytics] Initializing GA4: ${ga4Id}`);
        }
    }, [fbPixelId, ga4Id, isActive]);

    if (!isActive) return null;

    return (
        <>
            {/* Google Analytics 4 */}
            {ga4Id && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${ga4Id}');
                        `}
                    </Script>
                </>
            )}

            {/* Facebook Pixel */}
            {fbPixelId && (
                <Script
                    src="https://connect.facebook.net/en_US/fbevents.js"
                    strategy="afterInteractive"
                />
            )}
        </>
    );
}
