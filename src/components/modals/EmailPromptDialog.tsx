import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { useQueryClient } from "@tanstack/react-query";
import { INewUer, IUser } from "@/types/user.type";
import { useAccount } from "wagmi";
import {
  useLoginWithEmail,
  User,
  LinkedAccountWithMetadata,
  PrivyErrorCode,
} from "@privy-io/react-auth";

interface EmailPromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: IUser | null | undefined;
}

type DialogStep = "details" | "otp";

export const EmailPromptDialog = ({
  isOpen,
  onClose,
  currentUser,
}: EmailPromptDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<DialogStep>("details");

  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();
  const queryClient = useQueryClient();
  const { address: accountAddress } = useAccount();

  useEffect(() => {
    if (isOpen) {
      setName(currentUser?.fullName || "");
      setEmail("");
      setCode("");
      setStep("details");
    }
  }, [isOpen, currentUser]);

  const {
    sendCode,
    loginWithCode,
    state: privyLoginState,
  } = useLoginWithEmail({
    onComplete: async (params: {
      user: User;
      isNewUser: boolean;
      wasAlreadyAuthenticated: boolean;
      loginMethod: any | null;
      loginAccount: LinkedAccountWithMetadata | null;
    }) => {
      console.log(
        "Privy: Email verified for",
        params.user.email?.address,
        "Is new to Privy:",
        params.isNewUser
      );
      try {
        const updatePayload: INewUer = {
          fullName: name.trim(),
          email: email.trim(),
          avatar: currentUser?.avatar || undefined,
          newUser: !currentUser?.email,
        };
        await updateUser(updatePayload);

        const queryAddress = currentUser?.walletAddress || accountAddress;
        if (queryAddress) {
          await queryClient.invalidateQueries({
            queryKey: ["user", queryAddress],
          });
        }
        resetAndClose();
      } catch (error) {
        console.error(
          "Failed to update profile after Privy verification:",
          error
        );
        window.alert("Failed to update your profile. Please try again.");
      }
    },
    onError: (error: PrivyErrorCode) => {
      console.error("Privy login error code:", error);
      let errorMessage = `Privy verification failed. Error: ${error}`;
      window.alert(errorMessage); // Alert was previously commented out by user
    },
  });

  useEffect(() => {
    if (privyLoginState.status === "awaiting-code-input") {
      setStep("otp");
    }
    // You might want to add further logic here if privyLoginState.status === 'error'
    // for example, to reset the step, though onError above handles alerts.
  }, [privyLoginState.status]);

  const handleSendVerificationCode = async () => {
    if (name.trim() && email.trim() && email.includes("@")) {
      try {
        await sendCode({ email: email.trim() });
      } catch (error: any) {
        console.error("Failed to send verification code:", error);
        window.alert(
          error.message ||
            "Failed to send verification code. Check email and try again."
        );
      }
    } else {
      window.alert("Please enter a valid name and email address.");
    }
  };

  const handleVerifyOtpAndSave = async () => {
    if (code.trim().length === 6) {
      try {
        await loginWithCode({ code: code.trim() });
      } catch (error: any) {
        console.error("Failed to verify OTP:", error);
        window.alert(
          error.message || "Failed to verify OTP. Check code and try again."
        );
      }
    } else {
      window.alert("Please enter a valid 6-digit verification code.");
    }
  };

  const resetAndClose = () => {
    onClose();
  };

  const isLoading =
    privyLoginState.status === "sending-code" ||
    privyLoginState.status === "submitting-code" ||
    isUpdatingUser;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) resetAndClose();
      }}
    >
      <DialogContent className="sm:max-w-md bg-neutral-900 rounded-[24px] w-full max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "details" ? "Update Your Profile" : "Verify Your Email"}
          </DialogTitle>
          <DialogDescription>
            {step === "details"
              ? "Please enter your name and email. We'll send a code to verify your email."
              : `Enter the 6-digit code sent to ${email}.`}
          </DialogDescription>
        </DialogHeader>

        {step === "details" && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-4  rounded-xl border border-neutral-700 focus:ring-peach-400 focus:border-peach-400 outline-none"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-4  border border-neutral-700 focus:ring-peach-400 focus:border-peach-400 outline-none"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {step === "otp" && (
          <div className="grid gap-4 py-4 items-center justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => setCode(value)}
              disabled={isLoading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="border border-neutral-700 focus:ring-peach-400 focus:border-peach-400 outline-none" />
                <InputOTPSlot index={1} className="border border-neutral-700 focus:ring-peach-400 focus:border-peach-400 outline-none" />
                <InputOTPSlot index={2} className="border border-neutral-700 focus:ring-peach-400 focus:border-peach-400 outline-none" />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} className="border border-neutral-700 focus:ring-peach-400 focus:border-peach-400 outline-none" />
                <InputOTPSlot index={4} className="border border-neutral-700 focus:ring-peach-400 focus:border-peach-400 outline-none" />
                <InputOTPSlot index={5} className="border border-neutral-700 focus:ring-peach-400 focus:border-peach-400 outline-none" />
              </InputOTPGroup>
            </InputOTP>
            {/* <Button
              type="button"
              variant="link"
              onClick={() => {
                setStep("details");
                setCode("");
              }}
              disabled={isLoading}
              className="text-sm"
            >
              Change email address
            </Button> */}
          </div>
        )}

        <DialogFooter className="gap-2 sm:justify-between">
          {step === "otp" && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStep("details");
                setCode("");
              }}
              disabled={isLoading}
            >
              Back
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button
              type="button"
              variant="ghost"
              onClick={resetAndClose}
              disabled={isLoading && step === "otp"}
            >
              Cancel
            </Button>
            {step === "details" && (
              <Button
                type="button"
                onClick={handleSendVerificationCode}
                disabled={isLoading || !name.trim() || !email.includes("@")}
                className="bg-peach-400 hover:bg-peach-300 text-black rounded-full"
              >
                {privyLoginState.status === "sending-code"
                  ? "Sending Code..."
                  : "Send Code"}
              </Button>
            )}
            {step === "otp" && (
              <Button
                type="button"
                onClick={handleVerifyOtpAndSave}
                disabled={isLoading || code.length !== 6}
                className="bg-peach-400 hover:bg-peach-300 text-black rounded-full"
              >
                {privyLoginState.status === "submitting-code"
                  ? "Verifying..."
                  : isUpdatingUser
                  ? "Saving..."
                  : "Verify & Save"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
