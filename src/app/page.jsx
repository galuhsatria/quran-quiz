'use client';

import { X, ChevronRight, RotateCcw } from 'lucide-react';
import { useState, useEffect, useRef, useContext } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { guessSurah, guessVerse } from 'quran-quiz';
import { useRouter } from 'next/navigation';
import { QuizContext } from '@/context/Quiz.context';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Page() {
  const [listSurah, setListSurah] = useState([]);
  const [surahAmount, setSurahAmount] = useState();

  const [questionType, setQuestionType] = useState('tebak-nama-surah');

  const [search, setSearch] = useState('');
  const [dataSurah, setDataSurah] = useState();
  const [isShow, setIsShow] = useState(false);
  const listSurahRef = useRef(null);

  const [quiz, setQuiz] = useState();
  const { state, dispatch } = useContext(QuizContext);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function fetchSurahData() {
    try {
      const response = await fetch('https://api.quran.gading.dev/surah');
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const dataSurah = await response.json();
      setDataSurah(dataSurah.data);
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

  const handleSelectSurah = (namaLatin, number) => {
    const isAlreadySelected = listSurah.some((item) => item.number === number);
    if (!isAlreadySelected) {
      setListSurah((prevList) => [...prevList, { namaLatin, number }]);
    }

    setIsShow(false);
  };

  const handleGenerateQuiz = async () => {
    const selectedSurah = listSurah.map((surah) => surah.number);

    if (selectedSurah.length < 4) {
      alert('Jumlah surah kurang dari 4');
      return;
    }

    if (surahAmount < 3) {
      alert('Jumlah soal kurang dari 3');
      return;
    }

    try {
      setIsLoading(true);
      const data = await (questionType == 'tebak-nama-surah'
        ? guessSurah.bySurah({
            amount: Number(surahAmount),
            select: selectedSurah,
          })
        : guessVerse.bySurah({
            amount: Number(surahAmount),
            select: selectedSurah,
          }));

      setQuiz(data);
      dispatch({ type: 'GENERATE_QUIZ', payload: data });
      router.push('/quiz');
    } catch {
      console.log('Error occurred while setting quiz data');
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleReset = () => {
    setListSurah([]);
    setSurahAmount(0);
  };

  console.log(dataSurah);

  console.log(listSurah);

  return (
    <div className="max-w-4xl mx-auto px-4 mt-10 min-h-screen">
      <section className="text-center mb-12 border-b border-gray-800 pb-5 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-b from-purple-300 to-purple-500 bg-clip-text text-transparent">Al Quran Quiz</h1>
        <p className="text-sm text-gray-400 mt-3">Sebuah fitur untuk menghasilkan quiz tentang Al-Quran. Anda dapat menggunakanya untuk meningkatkan hafalan Al-Quran anda</p>
      </section>
      <div className="relative">
        <p className="font-semibold">Pilih Surah</p>
        <Input
          type="text"
          className="my-2"
          onFocus={() => setIsShow('block')}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Pilih minimal 4 surah"
        />
        <div className={`${isShow ? 'block' : 'hidden'} bg-[#0D1424] top-[4.5rem] border-x border-[#252831] border-b h-44 px-4 py-3 overflow-auto no-scrollbar rounded-b-lg absolute w-full`} ref={listSurahRef}>
          <ul className="flex flex-col gap-3">
            {dataSurah
              ? dataSurah
                  .filter((surah) => {
                    if (search === '') {
                      return true;
                    } else if (surah.name.transliteration.id.toLowerCase().includes(search.toLowerCase())) {
                      return true;
                    }
                    return false;
                  })
                  .map(({ name, number }) => (
                    <li key={number} onClick={() => handleSelectSurah(name.transliteration.id, number)} className="cursor-pointer border-b border-[#252831] py-2 hover:text-purple-500 transition-all duration-200">
                      {name.transliteration.id}
                    </li>
                  ))
              : 'Tidak ditemukan'}
          </ul>
        </div>
        <div>
          <p>Surah yang dipilih:</p>
          <ul className="flex gap-4 mt-3 max-w-4xl flex-wrap">
            {listSurah.map(({ namaLatin, number }, index) => (
              <li key={index}>
                <Badge className="flex items-center gap-1 cursor-pointer bg-purple-500 hover:bg-purple-500/80">
                  {namaLatin}
                  <X
                    className="w-4"
                    onClick={() => {
                      const updatedList = listSurah.filter((item) => item.number !== number);
                      setListSurah(updatedList);
                    }}
                  />
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-3.5">
        <p className="font-semibold">Jumlah Soal</p>
        <Input type="number" placeholder="Masukkan minimal 3 soal" min={0} className="my-2.5" onChange={(e) => setSurahAmount(e.target.value)} value={surahAmount} />
      </div>
      <div className="mt-3.5">
        <p className="font-semibold">Tipe Quiz</p>
        <Select className="w-full" onValueChange={(value) => setQuestionType(value)}>
          <SelectTrigger className="w-full bg-[#252831] my-2.5">
            <SelectValue placeholder="Tebak nama surah" />
          </SelectTrigger>
          <SelectContent className="w-full bg-slate-800 text-white border-slate-800">
            <SelectGroup>
              <SelectItem value="tebak-nama-surah" className="hover:bg-purple-500">
                Tebak nama surah
              </SelectItem>
              <SelectItem value="sambung-ayat">Sambung ayat</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4 items-center mt-6">
        <Button className="bg-purple-500 hover:bg-purple-600 w-36" onClick={handleGenerateQuiz}>
          {isLoading ? (
            <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <>
              Generate
              <ChevronRight />
            </>
          )}
        </Button>

        <Button onClick={handleReset} variant="destructive" className="flex gap-3 items-center">
          Reset <RotateCcw />
        </Button>
      </div>
    </div>
  );
}
