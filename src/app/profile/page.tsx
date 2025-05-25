import ProfileDashboardView from "@/components/profile/profile-dashboard/ProfileDashboardView";
import { Address } from "viem";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const userAddress = params.id as Address;

  return (
    <div className="mt-32 mb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <ProfileDashboardView userAddress={userAddress} />
    </div>
  );
}
