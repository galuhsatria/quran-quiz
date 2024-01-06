import { Inter } from 'next/font/google';
import './globals.css';
import { QuizContextProvider } from '@/context/Quiz.context';
import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Al Quran Quiz',
  description: 'ql quran quiz',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <QuizContextProvider>{children}</QuizContextProvider>
        <Footer />
      </body>
    </html>
  );
}
