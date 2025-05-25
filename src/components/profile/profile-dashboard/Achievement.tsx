"use client";

import React from "react";

interface AchievementProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Achievement: React.FC<AchievementProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-neutral-800 rounded-2xl p-6 flex gap-4">
    <div className="text-peach-400">{icon}</div>
    <div>
      <h3 className="font-medium text-white mb-1">{title}</h3>
      <p className="text-sm text-neutral-400">{description}</p>
    </div>
  </div>
);

export default Achievement; 