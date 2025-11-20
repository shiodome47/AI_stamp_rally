import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadArea from './components/UploadArea';
import StampCollection from './components/StampCollection';
import { analyzeImage } from './utils/geminiAI';

const INITIAL_STAMPS = [
  { id: 'cat', name: 'Neko Master', unlocked: false, keywords: ['cat'] },
  { id: 'fuji', name: 'Japan\'s Superb View', unlocked: false, keywords: ['fuji'] },
  { id: 'food', name: 'Gourmet Hunter', unlocked: false, keywords: ['food', 'ramen', 'sushi'] }, // Extra one for fun
  { id: 'nature', name: 'Nature Lover', unlocked: false, keywords: ['tree', 'flower', 'nature'] }, // Extra one
];

function App() {
  const [stamps, setStamps] = useState(INITIAL_STAMPS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [message, setMessage] = useState('');

  // Load from local storage on mount (optional, but good for UX)
  useEffect(() => {
    const saved = localStorage.getItem('ai-stamp-rally-data');
    if (saved) {
      setStamps(JSON.parse(saved));
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('ai-stamp-rally-data', JSON.stringify(stamps));
  }, [stamps]);

  const handleFileSelect = async (file) => {
    setIsAnalyzing(true);
    setMessage('Analyzing image...');

    try {
      const tags = await analyzeImage(file);
      console.log('Detected tags:', tags);

      let newUnlockedCount = 0;
      const newStamps = stamps.map(stamp => {
        if (stamp.unlocked) return stamp; // Already unlocked

        const hasMatch = stamp.keywords.some(keyword => tags.includes(keyword));
        if (hasMatch) {
          newUnlockedCount++;
          return { ...stamp, unlocked: true };
        }
        return stamp;
      });

      setStamps(newStamps);

      if (newUnlockedCount > 0) {
        setMessage(`Congratulations! You unlocked ${newUnlockedCount} new stamp(s)!`);
      } else {
        setMessage('No new stamps found in this image. Try a different one!');
      }

    } catch (error) {
      console.error(error);
      setMessage('Error analyzing image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const collectedCount = stamps.filter(s => s.unlocked).length;

  return (
    <div className="app-container">
      <Header collectedCount={collectedCount} totalCount={stamps.length} />

      <main>
        <UploadArea onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />

        {message && <div className="message-box">{message}</div>}

        <StampCollection stamps={stamps} />
      </main>
    </div>
  );
}

export default App;
