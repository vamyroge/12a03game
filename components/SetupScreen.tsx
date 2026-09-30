'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Question } from '@/lib/types';
import { validateQuestions } from '@/lib/gameUtils';
import { sounds } from '@/lib/audio';
import defaultQuestions from '@/data/questions.json';

interface SetupScreenProps {
  onStart: (imageUrl: string, questions: Question[]) => void;
}

export default function SetupScreen({ onStart }: SetupScreenProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions as Question[]);
  const [error, setError] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      sounds.click();
    }
  };

  const handleImportQuestions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        const validation = validateQuestions(data);
        
        if (!validation.valid) {
          setError(validation.error || 'Invalid questions file');
          sounds.wrong();
          return;
        }

        setQuestions(data);
        setError('');
        sounds.correct();
      } catch {
        setError('Failed to parse JSON file');
        sounds.wrong();
      }
    };
    reader.readAsText(file);
  };

  const handleExportQuestions = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'questions.json';
    link.click();
    URL.revokeObjectURL(url);
    sounds.click();
  };

  const handleStart = () => {
    if (!imageUrl) {
      setError('Please upload a secret image');
      sounds.wrong();
      return;
    }

    sounds.unlock();
    onStart(imageUrl, questions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 max-w-4xl w-full border border-white/20"
      >
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-7xl font-black text-center mb-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
        >
          WHO IS THIS?
        </motion.h1>
        <p className="text-center text-white/80 text-2xl mb-12">
          English Presentation Warm-up Game
        </p>

        <div className="space-y-8">
          {/* Image Upload */}
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-4">📷 Secret Image</h2>
            <div className="flex flex-col gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-2xl font-bold py-6 px-8 rounded-xl transition-all transform hover:scale-105"
              >
                {imageUrl ? '✓ Image Uploaded' : 'Upload Image'}
              </label>
              {imageUrl && (
                <div className="mt-4 rounded-xl overflow-hidden border-4 border-white/20">
                  <img src={imageUrl} alt="Secret" className="w-full h-64 object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-4">❓ Questions ({questions.length}/16)</h2>
            <div className="flex gap-4">
              <button
                onClick={handleExportQuestions}
                className="flex-1 bg-green-500/20 hover:bg-green-500/30 border-2 border-green-500 text-green-300 text-xl font-bold py-4 px-6 rounded-xl transition-all"
              >
                Export JSON
              </button>
              <label className="flex-1">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportQuestions}
                  className="hidden"
                />
                <div className="cursor-pointer bg-purple-500/20 hover:bg-purple-500/30 border-2 border-purple-500 text-purple-300 text-xl font-bold py-4 px-6 rounded-xl transition-all text-center">
                  Import JSON
                </div>
              </label>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-500/20 border-2 border-red-500 text-red-200 text-xl p-6 rounded-xl text-center"
            >
              ⚠️ {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white text-4xl font-black py-8 rounded-2xl shadow-2xl transition-all"
          >
            🚀 START GAME
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
