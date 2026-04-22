import { Smile, Frown, Meh, LucideIcon } from 'lucide-react';

export interface SentimentDetails {
  color: string;
  icon: LucideIcon;
  label: string;
}

/**
 * Розраховує стилі відображення настрою новини.
 * Створює "градієнт" від кольору до сірого через насиченість (saturation).
 */
export const getSentimentDetails = (score: number | null): SentimentDetails => {
  if (score === null) {
    return { color: 'hsl(0, 0%, 45%)', icon: Meh, label: 'Нейтрально' };
  }

  const absScore = Math.abs(score);
  const saturation = Math.min(100, absScore * 100); 
  
  if (score > 0.05) {
    return { 
      color: `hsl(142, ${saturation}%, 40%)`, 
      icon: Smile,
      label: 'Позитивно' 
    };
  }
  if (score < -0.05) {
    return { 
      color: `hsl(0, ${saturation}%, 45%)`, 
      icon: Frown,
      label: 'Негативно' 
    };
  }
  
  return { 
    color: 'hsl(0, 0%, 45%)', 
    icon: Meh,
    label: 'Нейтрально' 
  };
};
