"use client";

import { formatAmount } from "@/helpers/donations";
import React from "react";

interface TokenStatProps {
  tokenName: string;
  tokenTicker: string;
  amount: number;
}

const TokenStat: React.FC<TokenStatProps> = ({
  tokenName,
  tokenTicker,
  amount,
}) => (
  <div className="flex justify-between items-center py-3 border-b border-neutral-700 last:border-0">
    <div className="flex flex-col">
      <span className="font-mono text-lg text-white">${tokenTicker}</span>
      <span className="font-medium text-sm text-neutral-400">{tokenName}</span>
    </div>
    <span className="font-medium text-white">${formatAmount(amount)}</span>
  </div>
);

export default TokenStat;
