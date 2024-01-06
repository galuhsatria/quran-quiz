'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Dot, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Page() {
  const [dataSurah, setDataSurah] = useState('');
  const [isShow, setIsShow] = useState(false);

  const [search, setSearch] = useState('');
  const listSurahRef = useRef(null);

  async function fetchSurahData() {
    try {
      const response = await fetch('https://equran.id/api/v2/surat');
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const dataSurah = await response.json();
      setDataSurah(dataSurah?.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchSurahData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listSurahRef.current && !listSurahRef.current.contains(event.target)) {
        setIsShow(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 mt-14 min-h-screen">
      <div className="bg-gradient-to-r from-purple-500 to-purple-800 rounded-md pt-7 pb-10 mb-10">
        <p className="font-lateef text-3xl text-center">بِسْــــــــــــــــــمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ</p>
      </div>
      <div className="relative">
        <div className="flex items-center gap-4 bg-[#252831] px-4 rounded-sm">
          <Input
            type="text"
            className="my-1 focus:border-none border-none px-0"
            onFocus={() => setIsShow('block')}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Cari surah"
          />
          <Search className="text-zinc-400" />
        </div>
      </div>
      <div>
        <ul className="grid sm:grid-cols-2 grid-cols-1 md:grid-cols-3 gap-3 mt-10">
          {dataSurah ? (
            dataSurah.length > 0 ? (
              dataSurah
                .filter((surah) => {
                  if (search === '') {
                    return true;
                  } else if (surah.namaLatin.toLowerCase().includes(search.toLowerCase())) {
                    return true;
                  }
                  return false;
                })
                .map((surah, index) => (
                  <li key={index}>
                    <Link href={`/baca-alquran/surat/${surah.nomor}`} className="flex flex-col border bg-slate-800 border-slate-800 p-4 rounded-md hover:border hover:border-purple-500 transition-all duration-300">
                      <div className="flex gap-2">
                        <p>{surah.nomor}.</p>
                        <p>{surah.namaLatin}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <h3 className="text-2xl font-lateef">{surah.nama}</h3>
                        <div className="flex  mt-3 w-56 justify-end">
                          <p>{surah.tempatTurun}</p>
                          <Dot />
                          <p className="truncate">{surah.arti}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
            ) : (
              <p>Tidak ada data surah yang ditemukan</p>
            )
          ) : (
            <p>Loading...</p>
          )}
        </ul>
      </div>
    </div>
  );
}
