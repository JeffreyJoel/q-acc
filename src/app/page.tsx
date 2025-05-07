"use client";

import SearchComponent from "@/components/shared/Search";
import ProjectCard from "@/components/project/ProjectCard";
import { projects } from "@/constant/projects";
import { useState } from "react";
export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filteredProjects = projects.filter((project) => {
    const searchMatch =
      searchText === "" ||
      project.name.toLowerCase().includes(searchText.toLowerCase()) ||
      project.description.toLowerCase().includes(searchText.toLowerCase()) ||
      project.categories.some((category) =>
        category.toLowerCase().includes(searchText.toLowerCase())
      );

    const categoryMatch =
      selectedCategories.length === 0 ||
      project.categories.some((category) =>
        selectedCategories.includes(category)
      );

    return searchMatch && categoryMatch;
  });

  const newProjects = filteredProjects.filter((project) => project.isNew);
  const launchedProjects = filteredProjects.filter((project) => !project.isNew);

  return (
    <>
      <div className="mt-32 max-w-7xl mx-auto">
        <div className="text-center flex flex-col gap-4 mt-20 mb-12">
          <h1 className="text-4xl font-tusker-8 mt-12 font-bold  text-white ">
            THE FUTURE OF <span className="text-peach-400">TOKENIZATION</span>
          </h1>
          <p className="text-xl max-w-xl mx-auto mt-4 text-neutral-300">
            Browse through our portfolio of carefully selected Web3 startups
            participating in our Quadratic Accelerator program.
          </p>
        </div>
        <SearchComponent
          searchText={searchText}
          setSearchText={setSearchText}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />
        <div className="mt-16">
          <h2 className="text-xl font-medium font-tusker-8 text-white mb-6 flex items-center">
            New <span className="text-peach-300 ml-2">Projects</span>
          </h2>
          {newProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {newProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="bg-neutral-800 rounded-xl p-8 text-center mb-16">
              <p className="text-neutral-300">
                No new projects match your search criteria.
              </p>
            </div>
          )}
        </div>

        <div className="mt-16">
          <h2 className="text-xl font-medium font-tusker-8 text-white mb-6 flex items-center">
            Launched <span className="text-peach-300 ml-2">Projects</span>
          </h2>
          {launchedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {launchedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="bg-neutral-800 rounded-xl p-8 text-center mb-16">
              <p className="text-neutral-300">
                No launched projects match your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
