import { AlertTriangle, Loader2, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName, isLoading }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-[420px] bg-white rounded-[18px] shadow-[rgba(0,0,0,0.22)_3px_5px_30px_0px] overflow-hidden border border-[#e0e0e0] px-8 pt-8 pb-6 text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-[#fef2f2] text-[#ff3b30] rounded-[14px] flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>

            <h3 className="text-[22px] font-semibold font-['SF Pro Display'] text-[#1d1d1f] mb-2">Confirm Removal</h3>
            <p className="text-[14px] font-['SF Pro Text'] text-[#1d1d1f]/50 leading-relaxed mb-8">
              Are you sure you want to permanently delete <span className="text-[#1d1d1f] font-semibold">"{itemName}"</span>? This action is irreversible.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex-1 bg-[#f5f5f7] text-[#1d1d1f]/50 py-3 rounded-full text-[13px] font-['SF Pro Text'] font-semibold hover:bg-[#e8e8ed] hover:text-[#1d1d1f] transition-all"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 bg-[#ff3b30] text-white py-3 rounded-full text-[13px] font-['SF Pro Text'] font-semibold transition-all flex items-center justify-center gap-2 shadow-[rgba(255,59,48,0.3)_0_4px_12px] hover:bg-[#e0352b]"
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : (
                  <>
                    <Trash2 size={14} />
                    Confirm
                  </>
                )}
              </button>
            </div>

            <button
              className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-[#f5f5f7] text-[#1d1d1f]/40 hover:bg-[#e8e8ed] hover:text-[#1d1d1f] transition-all"
              onClick={onClose}
              disabled={isLoading}
            >
              <X size={17} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
