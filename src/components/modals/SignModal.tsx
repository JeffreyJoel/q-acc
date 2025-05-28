"use client";

import { motion } from "framer-motion";
import { Loader2, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSignUser } from '@/hooks/useSignUser';
import { IUser } from '@/types/user.type';
import type { FC } from 'react';

interface SignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign?: (user: IUser) => void;
}

export const SignModal: FC<SignModalProps> = props => {
  const { refetch, isFetching } = useSignUser(props.onSign);

  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-neutral-900 rounded-3xl w-full max-w-md overflow-hidden shadow-xl relative"
      >
         <div className="relative px-6 pt-6">
          <button
            onClick={props.onClose}
            className="absolute right-6 top-6 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            Sign Message to Continue
          </h2>
          <p className="mt-4 mb-10 text-neutral-300">
            Please sign the message to verify your wallet ownership and continue.
          </p>

          <div className="space-y-6">
            <Button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="w-full rounded-full bg-[#FBBA80] hover:bg-[#FBBA80]/90 text-neutral-900 font-medium py-6"
            >
              {isFetching ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign Message</span>
                  <ArrowRight size={16} />
                </div>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
