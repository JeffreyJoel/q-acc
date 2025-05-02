import Image from "next/image";
import Card from "@/components/card";
import { NavBar } from "@/components/shared/NavBar";
export default function Home() {
  return (
    <>
      <NavBar />
      <div className="mt-32 max-w-7xl mx-auto">
      <div className="text-center flex flex-col gap-4 my-20">
      <h1 className="text-4xl font-tusker-8 mt-10 font-bold  text-white ">
          THE FUTURE OF <span className="text-peach-400">
          TOKENIZATION
          </span>
        </h1>
        <p className="text-xl max-w-xl mx-auto mt-4 text-neutral-300">
          Browse through our portfolio of carefully selected Web3 startups
          participating in our Quadratic Accelerator program.
        </p>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 mb-10">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </>
  );
}
