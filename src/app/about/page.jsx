import Link from 'next/link';

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 mt-10 text-center min-h-screen">
      <p className="text-center">Powered by </p>
      <ul className='flex flex-col gap-3 mt-4'>
        <li>
          <p>Quran Quiz Generator Library:</p>
          <Link href="https://quran.zakiego.com/" className='text-blue-500 underline'>https://quran.zakiego.com/</Link>{' '}
        </li>
        <li>
          <p>Al Quran API:</p>
          <Link href="https://github.com/gadingnst/quran-api" className='text-blue-500 underline'>https://github.com/gadingnst/quran-api</Link>
        </li>{' '}
      </ul>
    </div>
  );
}
