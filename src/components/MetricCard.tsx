
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/components/ThemeProvider';

interface MetricCardProps {
  title: string;
  value: number;
  total?: number;
  color: string;
  onClick?: () => void;
}

const MetricCard = ({ title, value, total = 100, color, onClick }: MetricCardProps) => {
  // Calculate percentage for progress visualization
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const { theme } = useTheme();
  
  return (
    <div 
      className="metric-card cursor-pointer hover:scale-105 transition-transform" 
      onClick={onClick}
    >
      <div className="relative w-32 h-32 mb-10">
        <CircularProgressbar
          value={percentage}
          text={`${value}`}
          styles={buildStyles({
            textSize: '1.75rem',
            textColor: color,
            pathColor: color,
            trailColor: theme === 'light' ? 'rgba(200,200,200,0.3)' : 'rgba(255,255,255,0.1)',
            pathTransitionDuration: 0.5,
          })}
        />
        {total > 0 && (
          <div className={`absolute -bottom-8 left-0 right-0 text-xs text-center ${theme === 'light' ? 'text-gray-700' : 'text-dashboard-muted'}`}>
            of {total} total
          </div>
        )}
      </div>
      
      <h3 className={`text-lg font-medium mb-2 ${theme === 'light' ? 'text-black' : 'text-dashboard-text'}`}>{title}</h3>
      
      <div className="w-full mt-1">
        <Progress 
          value={percentage} 
          className="h-2 bg-opacity-20"
          style={{ 
            '--progress-background': color,
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
};

export default MetricCard;
