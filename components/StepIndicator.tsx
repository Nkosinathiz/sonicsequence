import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: 'Details' },
  { id: 2, label: 'Tracks' },
  { id: 3, label: 'Sequence' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-sm mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-px bg-zinc-800 -z-10" />
        
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-3 bg-[#09090b] px-2">
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300
                  ${isActive ? 'border-white bg-white text-black' : ''}
                  ${isCompleted ? 'border-zinc-700 bg-zinc-900 text-zinc-400' : ''}
                  ${!isActive && !isCompleted ? 'border-zinc-800 text-zinc-700 bg-[#09090b]' : ''}
                `}
              >
                {isCompleted ? <Check size={14} /> : <span className="text-xs font-mono font-bold">{step.id}</span>}
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-bold ${isActive ? 'text-white' : 'text-zinc-600'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};