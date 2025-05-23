"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccount } from "@getpara/react-sdk";
import { para } from "@/client/para";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot,
// } from "@/components/ui/input-otp";

interface EmailFormData {
  email: string;
}

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<EmailFormData>;
  onSubmit?: (data: EmailFormData) => Promise<void>;
}

export default function EmailModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: EmailModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [showOTP, setShowOTP] = useState(false);
  // const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState<EmailFormData>({
    email: "",
  });
  const { data: account } = useAccount();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      console.log(account);
      
      await para.setEmail(formData.email);
      await para.resendVerificationCode();
      console.log(account?.email);
      // setShowOTP(true);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleOTPSubmit = async () => {
  //   try {
  //     setIsSubmitting(true);
  //     await verifyAndCreateWallet(otp);
  //     onClose();
  //   } catch (error) {
  //     console.error("Error verifying OTP:", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const verifyAndCreateWallet = async (verificationCode: string) => {
  //   const setupUrl = await para.verifyEmail({ verificationCode });

  //   if (setupUrl) {
  //     const popupWindow = window.open(setupUrl, "signUpPopup", "popup=true");
  //     await para.setEmail(formData.email);
  //   }
  // };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#171717] rounded-3xl w-full max-w-md overflow-hidden shadow-xl"
      >
        <div className="relative px-6 pt-6">
          <h2 className="text-xl font-semibold text-white">
            Enter Your Email
          </h2>

          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-neutral-300 block text-sm mb-2"
              >
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="bg-[#2A2A2A] mt-4 py-6 focus:border-[#FBBA80] focus:ring-0 text-white placeholder:text-neutral-400 rounded-xl"
              />
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-full bg-[#FBBA80] hover:bg-[#FBBA80]/90 text-neutral-900 font-medium min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
