"use client";

import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle }) => (
  <div className="bg-neutral-800 rounded-2xl p-6">
    <h3 className="text-sm text-neutral-400 uppercase tracking-wider mb-2">
      {title}
    </h3>
    <div className="text-4xl font-bold text-white mb-1">{value}</div>
    {subtitle && <p className="text-sm text-neutral-400">{subtitle}</p>}
  </div>
);

export default StatsCard; 