"use client";

import Link from "next/link";
import { projectData } from "@/data/projects";
import GeneralInfo from "@/components/project/GeneralInfo";
import { ChevronLeft, Twitter, Github, Globe } from "lucide-react";
import { CopyButton } from "@/components/shared/CopyButton";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import TeamMember from "@/components/project/Team";
import { IconBrandX, IconBrandGithub } from "@tabler/icons-react";
import { GeckoTerminalChart } from "@/components/project/GeckoTerminal";

export default function ProjectPage({ params }: { params: { id: string } }) {
  return (
    <div className="mt-24 max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-peach-300 transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to projects
        </Link>
      </div>
      <div className="w-full mt-4 relative rounded-xl overflow-hidden h-[300px] md:h-[400px] mb-8">
        <div className="absolute inset-0">
          <img
            src={projectData.image || ""}
            alt={projectData.name || ""}
            className="w-full h-full object-cover "
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl -mt-32 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#111] rounded-xl p-4 flex-shrink-0">
              <img
                src={projectData.logo || "/placeholder.svg"}
                alt={`${projectData.name} logo`}
                className="w-20 h-20 rounded-lg object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-tusker-8">
                  {projectData.name}
                </h1>
                {projectData.isNew && (
                  <span className="bg-peach-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                    New
                  </span>
                )}
              </div>
              <div>
                <p className="text-gray-400 my-2 text-sm font-medium flex items-center">
                  {projectData.address.slice(0, 8)}...
                  {projectData.address.slice(
                    projectData.address.length - 8,
                    projectData.address.length
                  )}
                  <CopyButton text={projectData.address} />
                </p>
                <div className="flex space-x-3">
                  {projectData.website && (
                    <a
                      href={projectData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-neutral-800 hover:bg-neutral-700 transition-colors p-3 rounded-full"
                    >
                      <Globe className="w-5 h-5 text-white" />
                    </a>
                  )}
                  {projectData.twitter && (
                    <a
                      href={`https://twitter.com/${projectData.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-neutral-800 hover:bg-neutral-700 transition-colors p-3 rounded-full"
                    >
                      <IconBrandX className="w-5 h-5 text-white" />
                    </a>
                  )}
                  {projectData.github && (
                    <a
                      href={`https://github.com/${projectData.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-neutral-800 hover:bg-neutral-700 transition-colors p-3 rounded-full"
                    >
                      <IconBrandGithub className="w-5 h-5 text-white" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <GeckoTerminalChart projectId={projectData.id} tokenSymbol={projectData.tokenSymbol} />

        <GeneralInfo projectData={projectData} />

        <div className="mt-8 rounded-2xl p-6 mb-8">
          <Tabs defaultValue="about" className="w-full ">
            <TabsList className="gap-6 mb-6 bg-transparent rounded-full py-6">
              <TabsTrigger
                value="about"
                className="px-4 py-2 w-fit rounded-full hover:bg-neutral-800 hover:text-peach-400 data-[state=active]:bg-peach-400 data-[state=active]:text-black data-[state=active]:shadow-none"
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="px-4 py-2 w-fit rounded-full hover:bg-neutral-800 hover:text-peach-400 data-[state=active]:bg-peach-400 data-[state=active]:text-black text-base data-[state=active]:shadow-none"
              >
                Team
              </TabsTrigger>
              <TabsTrigger
                value="roadmap"
                className="px-4 py-2 w-fit rounded-full hover:bg-neutral-800 hover:text-peach-400 data-[state=active]:bg-peach-400 data-[state=active]:text-black data-[state=active]:shadow-none"
              >
                Roadmap
              </TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-0">
              <div>
                <p className="text-gray-300 mb-4">{projectData.description}</p>
                <p className="text-gray-300 whitespace-pre-line">
                  {projectData.longDescription}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="team" className="mt-0">
              <div className="flex flex-wrap justify-center gap-4 py-4">
                {projectData.team.map((member, index) => (
                  <TeamMember key={index} member={member} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="roadmap" className="mt-0">
              <div className="space-y-4 py-4">
                {projectData.roadmap.map((milestone, index) => (
                  <div key={index} className="relative pl-6">
                    <div
                      className={`absolute left-0 top-1.5 w-3 h-3 rounded-full ${
                        milestone.completed ? "bg-peach-400" : "bg-[#333]"
                      }`}
                    ></div>
                    {index < projectData.roadmap.length - 1 && (
                      <div className="absolute left-1.5 top-4 w-0.5 h-full bg-[#333]"></div>
                    )}
                    <div>
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-white">
                          {milestone.title}
                        </h3>
                        <span className="text-sm text-gray-400">
                          {milestone.date}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
