import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../providers/ThemeProvider';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: '@jjjuk',
    description:
        "jjjuk's landing page - Software developer & entrepreneur building products, communities, and big ideas. Founder of the SoyDev Discord community.",
    keywords: [
        'jjjuk',
        'software developer',
        'entrepreneur',
        'SoyDev',
        'SoyDev Discord',
        'Discord community',
        'developer community',
        'programming community',
        'tech community',
        'GitHub',
        'open source',
        'opensource contributor',
        'web development',
        'full stack developer',
        'TypeScript developer',
        'React developer',
        'Next.js developer',
        'JavaScript developer',
        'frontend developer',
        'backend developer',
        'software engineering',
        'coding community',
        'developer Discord server',
        'programming Discord',
        'tech Discord',
        'startup founder',
        'tech entrepreneur',
        'indie hacker',
        'developer tools',
        'programming resources',
        'coding help',
        'developer networking',
        'tech collaboration',
    ],
    authors: [{ name: 'jjjuk' }],
    creator: 'jjjuk',
    publisher: 'jjjuk',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://jjjuk.org',
        siteName: '@jjjuk',
        title: '@jjjuk - Software Developer & Entrepreneur',
        description:
            'Software developer & entrepreneur building products, communities, and big ideas. Founder of the SoyDev Discord community.',
        images: [
            {
                url: '/site_thumbnail.png',
                width: 460,
                height: 460,
                alt: 'jjjuk avatar',
            },
        ],
    },
    twitter: {
        card: 'summary',
        title: '@jjjuk - Software Developer & Entrepreneur',
        description:
            'Software developer & entrepreneur building products, communities, and big ideas. Founder of the SoyDev Discord community.',
        images: ['/site_thumbnail.png'],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider defaultTheme="system" storageKey="jjjuk-landing-theme">
                    {children}
                    <Analytics />
                </ThemeProvider>
            </body>
        </html>
    );
}
