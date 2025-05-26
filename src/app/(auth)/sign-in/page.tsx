import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/auth/SignInForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:flex flex-col items-center justify-center h-full bg-neutral-950">
        <div className="w-full my-auto flex flex-col justify-center">
          <div className="max-w-xl mx-auto text-white space-y-6">
            <h1 className="text-4xl leading-relaxed font-tusker-8 font-bold mb-8 text-center">
              Explore the Future of DeFi with{" "}
              <span className="text-peach-400">QACC</span>
            </h1>
            <p className="text-xl text-neutral-400 leading-relaxed text-center">
              Discover cutting-edge web3 projects, earn points, and track your
              portfolio in the first community-driven DeFi accelerator.
            </p>
            <div className="pt-4 space-y-2">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-peach-400 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-black">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">
                    Browse Projects
                  </h3>
                  <p className="text-gray-400">
                    Discover and research innovative Web3 startups
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-peach-400 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-black">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">
                    Support Projects
                  </h3>
                  <p className="text-gray-400">
                    Buy tokens and become an early backer
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-peach-400 flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-black">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">
                    Earn Points
                  </h3>
                  <p className="text-gray-400">
                    Track your portfolio and climb the leaderboard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10 bg-neutral-900">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <Image
              src="/images/logos/logo-horisontal-light.svg"
              alt="logo"
              width={100}
              height={100}
              className="w-[200px] h-auto hidden sm:block"
              priority
            />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center ">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
