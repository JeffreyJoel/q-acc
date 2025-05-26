import { PointsTable } from "@/components/leaderboard/PointsTable";

export default function LeaderboardPage() {
  return (
    <div className="mt-36 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
       <div className="mb-12 mx-auto text-center">
       <h1 className="text-4xl font-bold font-tusker-8 text-center mx-auto uppercase">Points <span className="text-peach-400">Leaderboard</span></h1>
          <p className="text-xl max-w-xl mx-auto mt-4 text-neutral-300">
          Climb the ranks, showcase your expertise
          </p>
       </div>
        <PointsTable />
      </div>
    </div>
  );
}
