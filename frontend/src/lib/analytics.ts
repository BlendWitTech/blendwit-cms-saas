// Google Analytics 4
export const initGA4 = (measurementId: string) => {
    if (typeof window === 'undefined') return;

    // Load gtag.js script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', measurementId);

    (window as any).gtag = gtag;
};

export const trackPageView = (url: string) => {
    if (typeof window === 'undefined' || !(window as any).gtag) return;

    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID, {
        page_path: url,
    });
};

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
    if (typeof window === 'undefined' || !(window as any).gtag) return;

    (window as any).gtag('event', eventName, params);
};

// Facebook Pixel
export const initFBPixel = (pixelId: string) => {
    if (typeof window === 'undefined') return;

    // Initialize fbq
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

    // Load pixel script
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    script.async = true;
    document.head.appendChild(script);

    // Initialize pixel
    (window as any).fbq('init', pixelId);
    (window as any).fbq('track', 'PageView');
};

export const trackFBEvent = (eventName: string, params?: Record<string, any>) => {
    if (typeof window === 'undefined' || !(window as any).fbq) return;

    (window as any).fbq('track', eventName, params);
};

// Custom event tracking
export const trackCustomEvent = (category: string, action: string, label?: string, value?: number) => {
    trackEvent(action, {
        event_category: category,
        event_label: label,
        value: value,
    });
};

// Page view tracking hook
export const usePageTracking = () => {
    if (typeof window === 'undefined') return;

    const handleRouteChange = (url: string) => {
        trackPageView(url);
    };

    return handleRouteChange;
};
