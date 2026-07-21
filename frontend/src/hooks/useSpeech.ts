import { useState, useEffect, useCallback, useRef } from 'react';
import { Language } from '../contexts/LanguageContext';

export const useSpeech = (language: Language) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop speech synthesis when components unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string) => {
    window.speechSynthesis.cancel();

    if (!text || text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice locales based on selected language
    const localeMap = {
      en: 'en-US',
      hi: 'hi-IN',
      te: 'te-IN'
    };

    utterance.lang = localeMap[language] || 'en-US';

    // Find and assign native voices on the device
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => v.lang.startsWith(localeMap[language]));
    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [language]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, []);

  return { speak, stop, isPlaying };
};
export default useSpeech;
