import { Minus, Plus } from 'lucide-react';

type Props = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  size?: 'sm' | 'md';
};

export default function QuantitySelector({ quantity, onDecrease, onIncrease, size = 'md' }: Props) {
  const btn = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
  const text = size === 'sm' ? 'text-xs' : 'text-sm';
  return (
    <div className="inline-flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
      <button
        onClick={onDecrease}
        className={`${btn} flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40`}
        disabled={quantity <= 1}
      >
        <Minus size={14} />
      </button>
      <span className={`${text} font-semibold min-w-[2.25rem] text-center text-gray-900`}>{quantity}</span>
      <button
        onClick={onIncrease}
        className={`${btn} flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
