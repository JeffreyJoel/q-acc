"use client";

import Link from "next/link";
import { useFetchProjectBySlug } from "@/hooks/useProjects";
import GeneralInfo from "@/components/project/GeneralInfo";
import { ChevronLeft, Globe } from "lucide-react";
import { CopyButton } from "@/components/shared/CopyButton";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import TeamMember from "@/components/project/Team";
import { IconBrandX, IconBrandGithub } from "@tabler/icons-react";
import { GeckoTerminalChart } from "@/components/project/GeckoTerminal";
import { IProject, EProjectSocialMediaType, TeamMember as TeamMemberType, IProjectSocialMedia } from "@/types/project.type";
import RichTextViewer from "@/components/project/RichTextViewer";
import Image from "next/image";

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { data: project, isLoading, error } = useFetchProjectBySlug(params.id);
  console.log(project);

  if (isLoading) {
    return <div className="mt-24 max-w-7xl mx-auto text-center">Loading project data...</div>;
  }

  if (error || !project) {
    return <div className="mt-24 max-w-7xl mx-auto text-center">Failed to load project data. {error?.message}</div>;
  }

  const twitterSocial = project.socialMedia?.find((s: IProjectSocialMedia) => s.type === EProjectSocialMediaType.X);
  const githubSocial = project.socialMedia?.find((s: IProjectSocialMedia) => s.type === EProjectSocialMediaType.GITHUB);
  const websiteSocial = project.socialMedia?.find((s: IProjectSocialMedia) => s.type === EProjectSocialMediaType.WEBSITE);

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
          <Image
            src={project.image || ""}
            alt={project.title || ""}
            className="w-full h-full object-cover rounded-xl "
            width={2000}
            height={2000}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl -mt-32 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#111] rounded-xl p-4 flex-shrink-0">
              <Image
                src={project.icon || "/placeholder.svg"}
                alt={`${project.title} logo`}
                width={200}
                height={200}
                className="w-20 h-20 rounded-lg object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-tusker-8">
                  {project.title}
                </h1>
              </div>
              <div>
                <p className="text-gray-400 my-2 text-sm font-medium flex items-center">
                  {project.walletAddress?.slice(0, 8)}...
                  {project.walletAddress?.slice(
                    project.walletAddress.length - 8,
                    project.walletAddress.length
                  )}
                  <CopyButton text={project.walletAddress || ''} />
                </p>
                <div className="flex space-x-3">
                  {websiteSocial && (
                    <a
                      href={websiteSocial.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-neutral-800 hover:bg-neutral-700 transition-colors p-3 rounded-full"
                    >
                      <Globe className="w-5 h-5 text-white" />
                    </a>
                  )}
                  {twitterSocial && (
                    <a
                      href={twitterSocial.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-neutral-800 hover:bg-neutral-700 transition-colors p-3 rounded-full"
                    >
                      <IconBrandX className="w-5 h-5 text-white" />
                    </a>
                  )}
                  {githubSocial && (
                    <a
                      href={githubSocial.link}
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
        
        {project.id && project.abc?.tokenTicker && (
           <GeckoTerminalChart projectId={parseInt(project.id, 10)} tokenSymbol={project.abc.tokenTicker} />
        )}

        <GeneralInfo projectData={project as IProject} />

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
                <RichTextViewer description={project.description} />
                
              </div>
            </TabsContent>
            <TabsContent value="team" className="mt-0">
              <div className="flex flex-wrap justify-center gap-4 py-4">
                {(project as any).teamMembers && (project as any).teamMembers.map((member: TeamMemberType, index: number) => (
                  <TeamMember 
                    key={index} 
                    member={{
                      name: member.name,
                      image: (member.image as unknown as string) || "/placeholder.svg",
                      role: "N/A",
                      twitter: member.twitter
                    }} 
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="roadmap" className="mt-0">
              <div className="space-y-4 py-4">
                <p className="text-gray-400">Roadmap data is not available for this project.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
