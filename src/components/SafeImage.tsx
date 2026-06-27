import React, { useState } from 'react';
import { 
  Droplet, 
  Trash2, 
  Lightbulb, 
  Wrench, 
  TrafficCone, 
  Accessibility, 
  AlertTriangle,
  ImageOff
} from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
  category?: string;
  fallbackClassName?: string;
}

export default function SafeImage({ src, alt, className, category, fallbackClassName, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [showIconFallback, setShowIconFallback] = useState(!src);

  // Sync state if src prop changes
  React.useEffect(() => {
    setImgSrc(src);
    setShowIconFallback(!src);
  }, [src]);

  const handleError = () => {
    const categoryLower = category?.toLowerCase() || '';
    let fallback = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop';
    if (categoryLower.includes('water') || categoryLower.includes('utility') || categoryLower.includes('pipe') || categoryLower.includes('hydrant')) {
      fallback = 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600&auto=format&fit=crop';
    } else if (categoryLower.includes('environmental') || categoryLower.includes('hazard') || categoryLower.includes('garbage') || categoryLower.includes('dumping') || categoryLower.includes('waste')) {
      fallback = 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=600&auto=format&fit=crop';
    } else if (categoryLower.includes('traffic') || categoryLower.includes('transit') || categoryLower.includes('street') || categoryLower.includes('light') || categoryLower.includes('signal')) {
      fallback = 'https://images.unsplash.com/photo-1494526508112-9c3f0bbfbf1f?q=80&w=600&auto=format&fit=crop';
    } else if (categoryLower.includes('accessibility') || categoryLower.includes('parking') || categoryLower.includes('ada') || categoryLower.includes('ramp')) {
      fallback = 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=600&auto=format&fit=crop';
    } else if (categoryLower.includes('health') || categoryLower.includes('safety') || categoryLower.includes('streetlight')) {
      fallback = 'https://images.unsplash.com/photo-1509024644558-2f56ce76c090?q=80&w=600&auto=format&fit=crop';
    }

    if (!imgSrc || imgSrc === fallback) {
      setShowIconFallback(true);
    } else {
      setImgSrc(fallback);
    }
  };

  if (showIconFallback) {
    const categoryLower = category?.toLowerCase() || '';
    
    // Choose icon based on category
    let IconComponent = AlertTriangle;
    let gradient = 'from-amber-500/10 to-orange-500/10 text-amber-500 border-amber-500/20';
    let label = 'Civic Alert';

    if (categoryLower.includes('water') || categoryLower.includes('utility') || categoryLower.includes('pipe') || categoryLower.includes('hydrant')) {
      IconComponent = Droplet;
      gradient = 'from-blue-500/10 to-indigo-500/10 text-blue-500 border-blue-500/20';
      label = 'Water & Utilities';
    } else if (categoryLower.includes('environmental') || categoryLower.includes('hazard') || categoryLower.includes('garbage') || categoryLower.includes('dumping') || categoryLower.includes('waste')) {
      IconComponent = Trash2;
      gradient = 'from-emerald-500/10 to-teal-500/10 text-emerald-500 border-emerald-500/20';
      label = 'Environmental';
    } else if (categoryLower.includes('traffic') || categoryLower.includes('transit') || categoryLower.includes('street') || categoryLower.includes('light') || categoryLower.includes('signal')) {
      IconComponent = TrafficCone;
      gradient = 'from-rose-500/10 to-orange-500/10 text-rose-500 border-rose-500/20';
      label = 'Traffic & Transit';
    } else if (categoryLower.includes('accessibility') || categoryLower.includes('parking') || categoryLower.includes('ada') || categoryLower.includes('ramp')) {
      IconComponent = Accessibility;
      gradient = 'from-violet-500/10 to-fuchsia-500/10 text-violet-500 border-violet-500/20';
      label = 'Accessibility';
    } else if (categoryLower.includes('infrastructure') || categoryLower.includes('pothole') || categoryLower.includes('cracks') || categoryLower.includes('bridge') || categoryLower.includes('road')) {
      IconComponent = Wrench;
      gradient = 'from-indigo-500/10 to-violet-500/10 text-indigo-500 border-indigo-500/20';
      label = 'Infrastructure';
    }

    return (
      <div 
        className={`flex flex-col items-center justify-center bg-gradient-to-br ${gradient} border rounded-xl p-4 text-center transition-all animate-fadeIn ${fallbackClassName || className || 'w-full h-full'}`}
      >
        <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 mb-2 transition-colors">
          <IconComponent className="w-5 h-5 animate-pulse" />
        </div>
        <span className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-85">{label}</span>
        <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 max-w-[90%] truncate block">{alt || 'Asset Visual'}</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
}
