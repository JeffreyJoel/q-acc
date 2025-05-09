"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useState } from "react";
import Stats from "./Stats";
export default function ProfileTab() {
  const [activeTab, setActiveTab] = useState("stats");

  return (
    <div className="mt-12 rounded-2xl">
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="bg-transparent p-0 h-auto mb-8">
        <TabsTrigger
            value="stats"
            className={`px-6 py-3 rounded-full ${
              activeTab === "stats" ? "bg-neutral-800 shadow-sm text-peach-400" : "bg-transparent"
            }`}
            onClick={() => setActiveTab("stats")}
          >
            My Stats
          </TabsTrigger>
          
          <TabsTrigger
            value="tokens"
            className={`px-6 py-3 rounded-full ${
              activeTab === "tokens" ? "bg-neutral-800 shadow-sm text-peach-400" : "bg-transparent"
            }`}
            onClick={() => setActiveTab("tokens")}
          >
            My Tokens
          </TabsTrigger>
          <TabsTrigger
            value="verifications"
            className={`px-6 py-3 rounded-full ${
              activeTab === "verifications"
                ? "bg-neutral-800 shadow-sm text-peach-400"
                : "bg-transparent"
            }`}
            onClick={() => setActiveTab("verifications")}
          >
            My Verifications
          </TabsTrigger>
        </TabsList>

        <TabsContent
            value="stats"
            className=""
          >
            <Stats />
        </TabsContent>

          <TabsContent
            value="tokens"
            className=""
          >
          <p className="text-gray-400 text-center text-xl my-20">
            You didn't support any project.
          </p>
        </TabsContent>

        <TabsContent
          value="verifications"
          className=""
        >
          <p className="text-gray-400 text-center text-xl my-20">No verifications yet.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
