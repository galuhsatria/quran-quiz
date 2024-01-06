'use client';

import React, { createContext, useReducer } from 'react';

const initialState = {
  quiz: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'GENERATE_QUIZ':
      return { ...state, quiz: [...state.quiz, action.payload] };
    default:
      return state;
  }
};

export const QuizContext = createContext({
  state: initialState,
  dispatch: () => null,
});

export const QuizContextProvider = ({ children }) => {
  const [quizData, dispatch] = useReducer(reducer, initialState);

  

  return <QuizContext.Provider value={{ quizData, dispatch }}>{children}</QuizContext.Provider>;
};
