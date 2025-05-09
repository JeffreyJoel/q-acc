import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileTab from "@/components/profile/ProfileTab";
export default function ProfilePage() {
  return (
    <div className="mt-32 mb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <ProfileInfo />
      <ProfileTab />
    </div>
  );
}
