import { type FC } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../ui/dialog";

interface ZkidEligibilityModal {
  isOpen: boolean;
  onClose: () => void;
}

export const ZkidEligibilityModal: FC<ZkidEligibilityModal> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Privado zkID</DialogTitle>
        </DialogHeader>

        <div className="">
          <p className="mt-4 mb-10 text-xl">
            The amount you want to submit requires Privado zkID credentials.
          </p>
          <button
            className="mx-auto bg-pink-400 text-white px-4 py-2 rounded-md"
            // styleType={ButtonStyle.Solid}
            // color={ButtonColor.Pink}
          >
            Go to Privado
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
