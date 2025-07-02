"use client";

import SearchComponent from "@/components/shared/Search";
import ProjectCard from "@/components/project/ProjectCard";
import { useState, useMemo } from "react";
import { useFetchAllProjects } from "@/hooks/useProjects";
import { IProject } from "@/types/project.type";
import ProjectCardLoader from "@/components/loaders/ProjectCardLoader";
import { useProjectsAggregatedData } from "@/hooks/useProjectsAggregatedData";

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);

  const { data: allProjects, isLoading, error } = useFetchAllProjects();

  const projects = useMemo(() => allProjects?.projects || [], [allProjects]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter((project: IProject) => {
      const searchMatch =
        searchText === "" ||
        (project.title &&
          project.title.toLowerCase().includes(searchText.toLowerCase())) ||
        (project.description &&
          project.description
            .toLowerCase()
            .includes(searchText.toLowerCase())) ||
        (project.categories &&
          project.categories.some((category) =>
            category.name.toLowerCase().includes(searchText.toLowerCase())
          ));

      const categoryMatch =
        selectedCategories.length === 0 ||
        (project.categories &&
          project.categories.some((category) =>
            selectedCategories.some((selectedCat) =>
              category.name.toLowerCase().includes(selectedCat.toLowerCase())
            )
          )) ||
        (project.title &&
          selectedCategories.some((selectedCat) =>
            project.title &&
            project.title.toLowerCase().includes(selectedCat.toLowerCase())
          )) ||
        (project.description &&
          selectedCategories.some((selectedCat) =>
            project.description &&
            project.description
              .toLowerCase()
              .includes(selectedCat.toLowerCase())
          )) ||
        (project.teaser &&
          selectedCategories.some((selectedCat) =>
            project.teaser &&
            project.teaser.toLowerCase().includes(selectedCat.toLowerCase())
          ));

      const seasonMatch =
        selectedSeasons.length === 0 ||
        (project.seasonNumber &&
          selectedSeasons.includes(project.seasonNumber.toString()));

      return searchMatch && categoryMatch && seasonMatch;
    });
  }, [projects, searchText, selectedCategories, selectedSeasons]);

  const { 
    aggregatedData, 
    loading: aggregatedDataLoading, 
    error: aggregatedDataError,
    getProjectData 
  } = useProjectsAggregatedData(filteredProjects);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-500">
          Error loading projects: {error.message}
        </p>
      </div>
    );
  }

  if (aggregatedDataError) {
    console.warn('Aggregated data error:', aggregatedDataError);
  }

  const shouldShowProjects = !isLoading && filteredProjects.length > 0;
  const shouldShowLoading = isLoading;

  return (
    <>
      <div className="mt-32 max-w-7xl mx-auto px-6 lg:px-4">
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
          selectedSeasons={selectedSeasons}
          setSelectedSeasons={setSelectedSeasons}
        />
        <div className="mt-16">
          <h2 className="text-xl font-medium font-tusker-8 text-white mb-6 flex items-center">
            All <span className="text-peach-300 ml-2">Projects</span>
            {aggregatedDataLoading && (
              <span className="ml-4 text-sm text-gray-400 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-peach-400"></div>
                Loading enhanced data...
              </span>
            )}
          </h2>
          {shouldShowLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProjectCardLoader key={index} />
              ))}
            </div>
          ) : shouldShowProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredProjects.map((project: IProject) => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  aggregatedData={getProjectData(project.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-neutral-800 rounded-xl p-8 text-center mb-16">
              <p className="text-neutral-300">
                No projects match your search criteria.
              </p>
            </div>
          )}
        </div>

        {/* Performance indicator for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded">
            Projects: {filteredProjects.length} | 
            Aggregated: {Object.keys(aggregatedData).length} | 
            Loading: {aggregatedDataLoading ? 'Yes' : 'No'}
          </div>
        )}
      </div>
    </>
  );
}
