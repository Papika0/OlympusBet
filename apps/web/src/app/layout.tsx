import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OlympusBet - Divine Crypto Casino',
  description: 'Ascend to Olympus. The next-generation crypto casino with Greek mythology RPG mechanics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
