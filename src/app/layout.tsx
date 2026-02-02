import './globals.css'; // Global styles (Tailwind CSS imports here)
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Appointor | Tattoo Studio Management & Salon Booking Software',
  description: 'Eliminate no-shows with automated deposits. The premier management platform for Tattoo Artists and Luxury Salon Studios to manage bookings & payments.',
  keywords: ['tattoo studio management software', 'salon booking app', 'tattoo artist booking system', 'deposit collection for artists', 'automated appointment reminders tattoo'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        <NextTopLoader
          color="#ec4899"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #ec4899,0 0 5px #ec4899"
        />
        {/* Children is your actual page content (Service Selection Page) */}
        {children}
      </body>
    </html>
  );
}