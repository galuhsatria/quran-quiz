'use client';
import React, { useEffect, useState } from 'react';
import { Dot } from 'lucide-react';

export default function Page({ params }) {
  const [dataSurah, setDataSurah] = useState('');

  async function fetchSurahData() {
    try {
      const response = await fetch(`https://equran.id/api/v2/surat/${params.slug}`);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 mt-16 min-h-screen">
      <div className=" bg-gradient-to-r from-purple-500 to-purple-800 py-10 rounded-md flex items-center flex-col justify-center">
        <div className="flex text-2xl items-center">
          <h3 className="text-xl">{dataSurah.namaLatin}</h3>
          <Dot />
          <h3 className="font-lateef">{dataSurah.nama}</h3>
        </div>
        <div className="flex items-center">
          <p>{dataSurah.tempatTurun}</p>
          <Dot />
          <p>{dataSurah.arti}</p>
          <Dot />
          <p>{dataSurah.jumlahAyat} Ayat</p>
        </div>
      </div>
      <div>
        <h1 className="font-lateef text-3xl text-center bg-slate-800 pt-7 pb-9 rounded-md mt-10">بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ</h1>
      </div>
      <div>
        <ul className="flex flex-col gap-2 mt-2">
          {dataSurah &&
            dataSurah.ayat.map((ayat, index) => (
              <li key={index} className="bg-slate-800 px-4 pb-6 pt-7 rounded-sm">
                <div>
                  <p className="font-lateef text-2xl text-end leading-loose">{ayat.teksArab}</p>
                </div>
                <div className="mt-5">
                  <p>{ayat.teksLatin}</p>
                  <p className="text-sm text-zinc-400 mt-2">{ayat.teksIndonesia}</p>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
