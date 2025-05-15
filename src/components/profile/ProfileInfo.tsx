import { Fingerprint } from "lucide-react";
import { CopyButton } from "../shared/CopyButton";
import Image from "next/image";

const address = "0x1234567890123456789012345678901234567890";
export default function ProfileInfo() {
  return (
    <div className="p-6 bg-neutral-800 rounded-2xl">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="w-[140px] h-[140px] bg-black rounded-lg overflow-hidden mr-4">
            <img
              src="/images/user.png"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center text-neutral-300">
            <span className="font-mono">
              {" "}
              {address.slice(0, 8)}...
              {address.slice(address.length - 8, address.length)}
              <CopyButton text={address} />
            </span>
          </div>
        </div>

        <button className="text-peach-400 font-medium hover:text-peach-300 transition-colors">
          Edit Profile
        </button>
      </div>

      <div className="mt-8 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center border-peach-100/30 border-[1px] border-r-4 border-b-4 shadow-sm rounded-xl px-4 py-2">
          <span className="text-neutral-300 mr-2">Your q/acc points</span>
          <div className="bg-black rounded-full w-5 h-5 flex items-center justify-center mr-1">
            <Image src="/images/logos/round_logo.png" alt="Q" width={16} height={16} priority />
          </div>
          <span className="font-bold ml-3">0</span>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center border border-red-400 rounded-xl px-4 py-2 text-neutral-300">
            <Fingerprint className="mr-2 text-neutral-500" size={20} />
            <span>Human Passport Not Verified</span>
          </div>

          <div className="flex items-center border border-red-400 rounded-xl px-4 py-2 text-neutral-300">
            <div className="mr-2 bg-neutral-800 w-5 h-5 rounded flex items-center justify-center">
              <span className="text-white text-xs">P</span>
            </div>
            <span>Privado zkID Not Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
