import { useMemo } from 'react';

export const useAnalysis = (transcript) => {
  const fillerWords = ["um", "uh", "like", "actually", "basically", "you know"];

  const stats = useMemo(() => {
    if (!transcript) return { totalFillerCount: 0, details: {}, wordCount: 0 };

    const wordsArray = transcript.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const totalWords = wordsArray.length;

    const foundFillers = wordsArray.reduce((acc, word) => {
      const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
      if (fillerWords.includes(cleanWord)) {
        acc[cleanWord] = (acc[cleanWord] || 0) + 1;
      }
      return acc;
    }, {});

    const totalFillerCount = Object.values(foundFillers).reduce((a, b) => a + b, 0);

    return { totalFillerCount, details: foundFillers, wordCount: totalWords };
  }, [transcript]);

  return stats;
};