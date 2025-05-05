import type React from "react"

interface Project {
  id: number
  name: string
  description: string
  image: string
  icon: string
  receivedAmount: string
  marketCap: string
  isNew: boolean
  categories: string[]
}

interface ProjectCardProps {
  project: Project
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="relative cursor-pointer p-4 w-full h-full rounded-xl bg-neutral-800 overflow-hidden shadow-gray-200">
      <div className="relative h-[550px]">
        <img
          alt={`${project.name} Cover`}
          loading="lazy"
          decoding="async"
          data-nimg="fill"
          className="rounded-xl"
          sizes="100vw"
          src={project.image || "/placeholder.svg"}
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            inset: "0px",
            objectFit: "cover",
            color: "transparent",
          }}
        />
        {project.isNew && (
          <div className="absolute bg-neutral-800 right-[-2px] top-0 py-[2px] pr-0 pl-2 rounded-tr-xl rounded-bl-2xl">
            <svg
              className="absolute left-[-18px] top-[-1px]"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="#262626"
            >
              <path d="M18 0V18C18 18 17.8462 7.84622 14 4C10.1538 0.153782 0 0 0 0H18Z" fill="#262626"></path>
            </svg>
            <span className="text-white font-redHatText font-semibold">New!</span>
            <svg
              className="absolute bottom-[-18px] right-[1px]"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="#262626"
            >
              <path d="M18 0V18C18 18 17.8462 7.84622 14 4C10.1538 0.153782 0 0 0 0H18Z" fill="#262626"></path>
            </svg>
          </div>
        )}
      </div>
      <div className="bg-neutral-800 absolute h-fit bottom-[-120px] hover:bottom-0 no-hover transition-bottom duration-500 ease-in-out left-4 right-4 py-4">
        <div className="absolute bg-neutral-800 left-0 -top-11 w-16 h-16 p-3 rounded-tr-xl rounded-bl-xl">
          <svg
            className="absolute top-[-18px] left-0"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="#262626"
          >
            <path d="M0 18V0C0 0 0.153782 10.1538 4 14C7.84622 17.8462 18 18 18 18H0Z" fill="#262626"></path>
          </svg>
          <img
            alt={`${project.name} Icon`}
            loading="lazy"
            width="50"
            height="50"
            decoding="async"
            data-nimg="1"
            src={project.icon || "/placeholder.svg"}
            style={{ color: "transparent" }}
          />
          <svg
            className="absolute bottom-5 right-[-18px]"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="#262626"
          >
            <path d="M0 18V0C0 0 0.153782 10.1538 4 14C7.84622 17.8462 18 18 18 18H0Z" fill="#262626"></path>
          </svg>
        </div>
        <svg
          className="absolute -top-[18px] right-0"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="#262626"
        >
          <path d="M18 18V0C18 0 17.8462 10.1538 14 14C10.1538 17.8462 0 18 0 18H18Z" fill="#262626"></path>
        </svg>
        <div className="relative flex flex-col gap-4 font-redHatText">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-white">{project.name}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.categories.map((category, index) => (
                <span key={index} className="text-xs px-2 py-1 bg-neutral-700 text-neutral-300 rounded-full">
                  {category}
                </span>
              ))}
            </div>
          </div>
          <div className="min-h-[100px] text-ellipsis">
            <p className="text-gray-400 overflow-hidden font-redHatText line-clamp-4 leading-6 px-2">
              {project.description}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="p-2 flex justify-between items-center bg-neutral-800 rounded-lg">
              <div className="text-gray-200 font-bold text-sm">Received this round</div>
              <div className="flex flex-col">
                <span className="text-gray-200 font-bold text-lg"> ~ $ {project.receivedAmount}</span>
              </div>
            </div>
            <hr />
            <div className="p-2 flex justify-between items-center rounded-lg">
              <span className="text-sm text-gray-300 font-bold"> Market Cap</span>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg text-right"> $ {project.marketCap}</span>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <button className="px-6 py-4 rounded-full text-sm font-bold items-center flex gap-2 text-white bg-giv-500 w-full justify-center opacity-80 hover:opacity-100">
              Buy Token
            </button>
            <button className="px-6 py-4 text-black rounded-full text-sm font-bold flex gap-2 text-giv-500 bg-peach-400 w-full justify-center items-center">
              Review Project
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
