"use client"

import { IconBrandX } from "@tabler/icons-react"
import Link from "next/link"

interface TeamMemberProps {
  member: {
    name: string
    role: string
    image: string
    twitter?: string
  }
}

const TeamMember = ({ member }: TeamMemberProps) => {
  return (
    <div className="bg-neutral-800 w-[250px] p-4 h-auto rounded-2xl flex flex-col items-center text-center">
      <div className="relative mb-3">
        <img
          src={member.image || "/placeholder.svg"}
          alt={member.name}
          width={200}
          height={200}
          className="w-[200px] h-[200px] rounded-xl object-cover"
        />
       
      </div>
      <h3 className="font-bold text-white text-sm">{member.name}</h3>
      <p className="text-gray-400 text-xs mt-1">{member.role}</p>
      {member.twitter && (
          <Link
            href={`https://twitter.com/${member.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-neutral-800 p-1 rounded-full border border-[#222]"
          >
            <IconBrandX className="w-5 h-5" />
          </Link>
        )}

    </div>
  )
}

export default TeamMember
