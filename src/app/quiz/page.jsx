'use client';

import { Button } from '@/components/ui/button';
import { QuizContext } from '@/context/Quiz.context';
import Link from 'next/link';
import { useState, useEffect, useContext } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [question, setQuestion] = useState({});
  const [typeQuestion, setTypeQuestion] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [disabledOptions, setDisabledOptions] = useState(false);
  const [marks, setMarks] = useState(0);

  const { quizData } = useContext(QuizContext);

  useEffect(() => {
    if (quizData && quizData.quiz && quizData.quiz.length > questionIndex) {
      const quizs = quizData.quiz.map(({ data, meta }) => {
        setTypeQuestion(meta.type);
        return data.map((quiz) => ({ ...quiz }));
      });

      setQuestion(quizs[questionIndex]);
    }
  }, [quizData, questionIndex]);

  const handleSelectAnswer = (event, selected) => {
    if (!disabledOptions) {
      setDisabledOptions(true);

      if (selected === 1) {
        event.target.classList.add('bg-green-500');
        setMarks(marks + 1);
      } else {
        event.target.classList.add('bg-red-600');
        const correctOption = document.querySelector('li[data-answer="1"]');
        correctOption.classList.add('bg-green-500');
      }
    }

    const options = document.querySelectorAll('.option');
    options.forEach((option) => {
      option.classList.remove('cursor-pointer');
      option.classList.remove('hover:bg-slate-800');
    });
  };

  const handleNextQuestion = () => {
    setQuestionIndex(questionIndex + 1);
    setDisabledOptions(false);

    const options = document.querySelectorAll('.option');
    options.forEach((option) => {
      option.classList.remove('bg-green-500');
      option.classList.remove('bg-red-600');
      option.classList.add('cursor-pointer');
      option.classList.add('hover:bg-slate-800');
    });
  };

  const handleGenerateQuizLink = () => {
    router.push('/');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  let quiz = question[questionIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 mt-16 min-h-screen">
      {Object.keys(question).length === 0 ? (
        <p className="text-center">
          Silahkan generate quiz terlebih dahulu{' '}
          <Link href={'/'} className="text-purple-500">
            disni
          </Link>
        </p>
      ) : (
        <div className="border border-slate-800 rounded-lg p-4 my-10">
          <div className="flex justify-between items-center gap-4">
            <p className="bg-purple-500 rounded-full px-3 h-max py-1 mr-3">{questionIndex + 1}</p>
            <h3 className="text-2xl font-medium py-5 mb-5 leading-loose text-right font-lateef">{quiz.question}</h3>
          </div>
          <div>
            <ul className="flex flex-col gap-3">
              {quiz.options &&
                quiz.options.map((option, index) => (
                  <li
                    key={index}
                    className={`option border rounded-md border-slate-800 hover:bg-slate-800 cursor-pointer p-3 ${typeQuestion === 'guessVerseBySurah' ? 'text-right font-lateef leading-loose' : ''}`}
                    onClick={(event) => handleSelectAnswer(event, option.value, option.value === 1)}
                    data-answer={option.value === 1 ? '1' : '0'}
                  >
                    {option.text}
                  </li>
                ))}
            </ul>
          </div>
          <div>
            {Object.keys(question).length === questionIndex + 1 ? (
              <AlertDialog className="bg-slate-800">
                <AlertDialogTrigger asChild>
                  <Button className="bg-purple-500 w-full mt-5 hover:bg-purple-700 disabled:bg-purple-500/60" disabled={!disabledOptions}>
                    Selesai
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#0D1424] border-slate-800 text-center">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">
                      Skor anda {marks}/{Object.keys(question).length}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">Selamat telah menyelesaikan quiz, ayo coba lagi</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction className="bg-purple-500 hover:bg-purple-700 mx-auto" onClick={handleGenerateQuizLink}>
                      Generate Quiz
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button className="bg-purple-500 w-full mt-5 hover:bg-purple-700 disabled:bg-purple-500/60" disabled={!disabledOptions} onClick={handleNextQuestion}>
                Next
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
