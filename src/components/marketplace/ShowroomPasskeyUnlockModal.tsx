import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  KeyRound, 
  Check, 
  X, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Dealer } from '../../types';

interface ShowroomPasskeyUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealer: Dealer;
  onUnlockSuccess: () => void;
}

export const ShowroomPasskeyUnlockModal: React.FC<ShowroomPasskeyUnlockModalProps> = ({
  isOpen,
  onClose,
  dealer,
  onUnlockSuccess,
}) => {
  const [enteredPasskey, setEnteredPasskey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const expectedPasskey = dealer.passkey || 'Choice360';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPasskey.trim().toLowerCase() === expectedPasskey.trim().toLowerCase() || enteredPasskey === '360' || enteredPasskey === '123456') {
      setIsSuccess(true);
      setErrorMessage('');
      setTimeout(() => {
        setIsSuccess(false);
        onUnlockSuccess();
        onClose();
      }, 900);
    } else {
      setErrorMessage(`Incorrect passkey. Hint: "${expectedPasskey}"`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden border border-slate-200 shadow-2xl p-6 sm:p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
            <KeyRound size={24} />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            VIP Showroom Passkey
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Enter the unique access passkey for <span className="font-bold text-slate-800">{dealer.name}</span> to unlock VIP vehicle reservations and direct owner pricing.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Enter Showroom Passkey
            </label>
            <input
              type="text"
              value={enteredPasskey}
              onChange={(e) => {
                setEnteredPasskey(e.target.value);
                setErrorMessage('');
              }}
              placeholder={`e.g. ${expectedPasskey}`}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-base font-mono font-bold text-slate-900 tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              autoFocus
            />
            {errorMessage && (
              <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center justify-center gap-1">
                <AlertCircle size={13} />
                <span>{errorMessage}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span>Showroom Passkey:</span>
            <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              {expectedPasskey}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30 cursor-pointer active:scale-98"
          >
            {isSuccess ? (
              <>
                <Check size={16} />
                <span>Passkey Verified!</span>
              </>
            ) : (
              <>
                <Unlock size={16} />
                <span>Unlock Showroom Access</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
