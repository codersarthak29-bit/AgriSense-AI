import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export type AlertType = 'info' | 'success' | 'warning' | 'danger';

interface AlertBannerProps {
  type?: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const typeConfig: Record<
  AlertType,
  { bg: string; border: string; text: string; icon: React.ReactNode }
> = {
  info: {
    bg: 'bg-blue-50/90',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
  },
  success: {
    bg: 'bg-emerald-50/90',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    icon: <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
  },
  warning: {
    bg: 'bg-amber-50/90',
    border: 'border-amber-200',
    text: 'text-amber-800',
    icon: <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
  },
  danger: {
    bg: 'bg-rose-50/90',
    border: 'border-rose-200',
    text: 'text-rose-800',
    icon: <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
  },
};

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const cfg = typeConfig[type];

  const handleDismiss = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm transition-all ${cfg.bg} ${cfg.border} ${cfg.text} ${className}`}
    >
      <div className="mt-0.5">{cfg.icon}</div>
      <div className="flex-1 text-sm">
        {title && <h5 className="font-semibold mb-0.5">{title}</h5>}
        <p className="opacity-90">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={handleDismiss}
          className="text-stone-400 hover:text-stone-600 transition-colors p-1"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
