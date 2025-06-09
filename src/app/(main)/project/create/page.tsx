"use client";

import { useAccount } from "wagmi";
import CreateProjectForm from "@/components/project/create/CreateProjectForm";

export default function CreateProjectPage() {
//   const { isConnected } = useAccount();

  return (
    <div className="container h-full min-h-screen mx-auto">
      <CreateProjectForm />
    </div>
  );
}
