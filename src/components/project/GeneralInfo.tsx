import { Clock, Ticket, RefreshCw, Calculator, Wallet } from "lucide-react";

interface GeneralInfoProps {
  projectData: any;
}

export default function GeneralInfo({ projectData }: GeneralInfoProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-neutral-800 rounded-2xl p-6 backdrop-blur-lg bg-opacity-80">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-gray-400 mb-2">Full amount</div>
              <div className="text-3xl font-bold">$75 000</div>
            </div>
            <div>
              <div className="text-gray-400 mb-2">
                Tickets Sold / Total Tickets
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="text-peach-400" size={20} />
                <span>TBA</span>
              </div>
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
              <Ticket size={20} className="text-gray-400" />
              <span>1 ticket =</span>
              <span className="font-bold">TBA</span>
            </div>
            <div className="flex items-center gap-3">
              <img
                src="https://images.pexels.com/photos/8721318/pexels-photo-8721318.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Token"
                className="w-5 h-5 rounded-full"
              />
              <span>Token Price</span>
              <span className="font-bold">1 KLINK = $0.02</span>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw size={20} className="text-gray-400" />
              <span>Refund</span>
              <span className="font-bold">7 days</span>
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-2">
              Round 1. Guaranteed for{" "}
              <span className="text-blue-400">DIAMOND</span>
            </div>
            <div>
              Phase 2. FCFS round for{" "}
              <span className="text-gray-400">ALL</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-neutral-800 rounded-2xl p-6 backdrop-blur-lg bg-opacity-80">
          <h2 className="text-xl font-bold mb-6">Prepare to participate</h2>
          <div className="space-y-6">
            <div>
              <div className="text-gray-400 mb-2">Wallet balance</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src="https://images.pexels.com/photos/8721329/pexels-photo-8721329.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="USDT"
                    className="w-6 h-6 rounded-full"
                  />
                  <span>- USDT</span>
                </div>
                <button className="flex items-center gap-2 text-peach-400 hover:text-[#7FE32A] transition-colors">
                  <Calculator size={16} />
                  Calculate
                </button>
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-2">
                Next step will be started
              </div>
              <div className="text-lg">To be announced (TBA)</div>
            </div>
            <button className="w-full bg-peach-400 text-black font-medium py-3 rounded-xl hover:bg-[#7FE32A] transition-colors flex items-center justify-center gap-2">
              <Wallet size={20} />
              Connect wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 