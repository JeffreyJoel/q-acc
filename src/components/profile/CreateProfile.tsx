"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ProfileFormData {
  email: string;
  fullName: string;
  username: string;
  profileImage: string | null;
  termsAgreed: boolean;
}

interface ProfileCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<ProfileFormData>;
  onSubmit?: (data: ProfileFormData) => Promise<void>;
}

export default function ProfileCreationModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: ProfileCreationModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    email: "",
    fullName: "",
    username: "",
    profileImage: null,
    termsAgreed: false,
  });

  // Initialize form with initial data if any
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          profileImage: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const skipStep = () => {
    if (step < 3) {
      nextStep();
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (onSubmit) {
        await onSubmit(formData);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#171717] rounded-3xl w-full max-w-md overflow-hidden shadow-xl"
      >
        <div className="relative px-6 pt-6 ">
          <h2 className="text-xl font-semibold text-white">
            Create Your Profile
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            Step {step} of 3:{" "}
            {step === 1 ? "Email" : step === 2 ? "Personal Info" : "Terms"}
          </p>

          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pt-4 flex items-center gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i === step
                  ? "bg-[#FBBA80] flex-grow"
                  : i < step
                  ? "bg-[#FBBA80] w-8"
                  : "bg-neutral-600 w-8"
              )}
            />
          ))}
        </div>

        <div className="px-6 py-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <label htmlFor="email" className="text-neutral-300 text-xs">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="bg-neutral-700 border-neutral-600 focus:border-[#FBBA80] focus:ring-[#FBBA80]/20 text-white placeholder:text-neutral-400 rounded-xl"
                  />
                </div>

                <div className="mt-8 flex justify-between">
                  <Button
                    type="button"
                    onClick={skipStep}
                    variant="ghost"
                    className="text-neutral-400 hover:text-white hover:bg-neutral-700"
                  >
                    Skip
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="rounded-full bg-[#FBBA80] hover:bg-[#FBBA80]/90 text-neutral-900 font-medium"
                  >
                    Continue <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Profile Image */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative group">
                    <div
                      className={cn(
                        "w-28 h-28 rounded-full overflow-hidden border-2 flex items-center justify-center",
                        formData.profileImage
                          ? "border-[#FBBA80] "
                          : "border-neutral-600 border-dashed"
                      )}
                    >
                      {formData.profileImage ? (
                        <img
                          src={formData.profileImage || "/placeholder.svg"}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload className="text-neutral-400 group-hover:text-[#FBBA80] transition-colors" />
                      )}
                    </div>
                    <input
                      type="file"
                      id="profileImage"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
              
                  </div>
                  <p className="text-neutral-400 text-xs mt-3">
                    Upload profile picture
                  </p>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label htmlFor="fullName" className="text-neutral-300 text-xs">
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="bg-neutral-700 border-neutral-600 focus:border-[#FBBA80] focus:ring-[#FBBA80]/20 text-white placeholder:text-neutral-400 rounded-xl"
                  />
                </div>

                {/* Username */}
                <div className="space-y-1">
                  <label htmlFor="username" className="text-neutral-300 text-xs">
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Choose a unique username"
                    className="bg-neutral-700 border-neutral-600 focus:border-[#FBBA80] focus:ring-[#FBBA80]/20 text-white placeholder:text-neutral-400 rounded-xl"
                  />
                </div>

                <div className="mt-16 flex justify-between">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="secondary"
                      className="text-neutral-300  hover:text-white rounded-full"
                    >
                      <ArrowLeft size={16} className="mr-2" /> Back
                    </Button>
                    <Button
                      type="button"
                      onClick={skipStep}
                      variant="ghost"
                      className="text-neutral-400 hover:text-white hover:bg-neutral-700"
                    >
                      Skip
                    </Button>
                  </div>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="rounded-full bg-[#FBBA80] hover:bg-[#FBBA80]/90 text-neutral-900 font-medium"
                  >
                    Continue <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="p-4 bg-neutral-700/50 rounded-lg border border-neutral-700">
                  <h3 className="font-medium text-white mb-2">
                    Terms of Service
                  </h3>
                  <div className="text-sm text-neutral-300 h-32 overflow-y-auto pr-2 custom-scrollbar">
                    <p className="mb-2">
                      By using our service, you agree to the following terms and
                      conditions:
                    </p>
                    <p className="mb-2">
                      1. You are responsible for maintaining the confidentiality
                      of your account.
                    </p>
                    <p className="mb-2">
                      2. You agree not to use the service for any illegal or
                      unauthorized purpose.
                    </p>
                    <p className="mb-2">
                      3. We reserve the right to modify or terminate the service
                      for any reason, without notice at any time.
                    </p>
                    <p>
                      4. We reserve the right to refuse service to anyone for
                      any reason at any time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start pt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="termsAgreed"
                      name="termsAgreed"
                      type="checkbox"
                      checked={formData.termsAgreed}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-neutral-600 text-[#FBBA80] focus:ring-[#FBBA80]/20 bg-neutral-700"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="termsAgreed" className="text-neutral-300">
                      I agree to the Terms of Service
                    </label>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="secondary"
                      className="text-neutral-300  hover:text-white rounded-full"
                    >
                      <ArrowLeft size={16} className="mr-2" /> Back
                    </Button>
                    <Button
                      type="button"
                      onClick={skipStep}
                      variant="ghost"
                      className="text-neutral-400 hover:text-white hover:bg-neutral-700"
                    >
                      Skip
                    </Button>
                  </div>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="rounded-full bg-[#FBBA80] hover:bg-[#FBBA80]/90 text-neutral-900 font-medium min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Profile"
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
