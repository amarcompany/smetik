import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  onComplete?: () => void;
  onUpdate?: () => void;
  render?: (typedText: string) => React.ReactNode;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ text, onComplete, onUpdate, render }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    const length = text.length;
    if (length === 0) {
      if (onComplete) onComplete();
      return;
    }

    // Determine proportional chunk increments so that long responses stream rapidly
    const charsPerStep = Math.max(1, Math.ceil(length / 200)); 
    const stepTime = 12; // Fast and premium typing rhythm

    const interval = setInterval(() => {
      index += charsPerStep;
      if (index >= length) {
        setDisplayedText(text);
        clearInterval(interval);
        if (onUpdate) onUpdate();
        if (onComplete) onComplete();
      } else {
        setDisplayedText(text.slice(0, index));
        if (onUpdate) onUpdate();
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [text]);

  if (render) {
    return <>{render(displayedText)}</>;
  }

  return <span className="whitespace-pre-wrap">{displayedText}</span>;
};
