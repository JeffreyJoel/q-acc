import { IconMoneybag } from "@tabler/icons-react";
import {
  Clock,
  Wallet,
  Coins,
  ChartColumn,
} from "lucide-react";
import { IProject } from "@/types/project.type";
interface GeneralInfoProps {
  projectData: IProject;
}

export default function GeneralInfo({ projectData }: GeneralInfoProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-neutral-800 rounded-2xl p-6 backdrop-blur-lg bg-opacity-80">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-gray-400 mb-2">Total contributed amount</div>
              <div className="text-3xl font-bold">${projectData.totalDonations}</div>
            </div>
            <div>
              {/* <div className="text-gray-400 mb-2">Time Remaining</div>
              <div className="flex items-center gap-2">
                <Clock className="text-peach-400" size={24} />
                <span className="text-2xl font-bold">TBA</span>
              </div> */}
            </div>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-2xl p-6 backdrop-blur-lg bg-opacity-80">
          <h2 className="text-xl font-bold mb-6">General Info</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-gray-400" />
              <span>Public sale will start in</span>
              <span className="font-bold">TBA</span>
            </div>
            <div className="flex items-center gap-3">
              <IconMoneybag className="text-gray-400" size={20} />
              <span>
                Total tokens supply = <span className="font-bold">{projectData.abc?.totalSupply}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Coins className="text-gray-400" size={20} />
              <span>Token Price</span>
              <span className="font-bold">1 ${projectData.abc?.tokenTicker} = ${projectData.abc?.tokenPrice}</span>
            </div>
            <div className="flex items-center gap-3">
              <ChartColumn size={20} className="text-gray-400" />
              <span>Market cap</span>
              <span className="font-bold">$100, 000</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 row-2">
        <div className="bg-neutral-800 rounded-2xl p-6 backdrop-blur-lg bg-opacity-80">
          <p className="text-gray-300 font-medium">
            Backed by <span className="text-white font-bold">{projectData.countUniqueDonors}</span>{" "}
            supporters
          </p>
          <div className="space-y-6">
            <div className="mt-6">
              {/* <div className="text-gray-400 mb-2">Wallet balance</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet size={20} />
                  <span className="text-neutral-300 font-semibold">
                    $500{" "}
                  </span>{" "}
                  / <span className="text-neutral-300 font-semibold">200 </span>{" "}
                  $POL
                </div>
              </div> */}
            </div>
            <div>
              <p className="text-gray-400 font-medium mb-2">Token price</p>
              <div className="flex items-center gap-2">
                <p className="text-neutral-300 text-lg font-semibold">${projectData.abc?.tokenPrice}</p>{" "}
                <span className="text-sm text-green-400 font-medium">
                  + 10% (24h)
                </span>
              </div>
            </div>
            <button className="w-full bg-peach-400 text-black font-medium py-3 rounded-full hover:bg-peach-300 transition-colors flex items-center justify-center gap-2">
              <Coins size={20} />
              Buy ${projectData.abc?.tokenTicker}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
