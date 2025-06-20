'use client'

import React from "react";
import { useFormContext } from "react-hook-form";
import { Dropzone } from "@/components/ui/dropzone";
import { Input } from "@/components/ui/input";
import { SocialMediaInput } from "@/components/project/create/SocialMediaInput";
import { validators } from "@/components/project/create/validators";
import { TeamMember } from "@/types/project.type";

interface TeamFormProps {
  index: number;
  teamMember: TeamMember;
  removeMember: () => void;
  isEdit?: boolean;
}

const socialMediaLinks = [
  {
    name: "twitter",
    label: "Twitter",
    iconName: "twitter.svg",
    rules: validators.twitter,
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    iconName: "linkedin.svg",
    rules: validators.linkedin,
  },
  {
    name: "farcaster",
    label: "Farcaster",
    iconName: "farcaster.svg",
    rules: validators.farcaster,
  },
];

export const TeamForm: React.FC<TeamFormProps> = ({
  index,
  teamMember,
  removeMember,
  isEdit = false,
}) => {
  const { setValue, register } = useFormContext();

  const handleDrop = (name: string, file: File, ipfsHash: string) => {
    if (file) {
      setValue(name, { file, ipfsHash });
    }
  };

  return (
    <section className="bg-neutral-800 p-8 flex flex-col gap-8 rounded-2xl mt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl mb-8">{isEdit ? "Edit" : "Add"} Your Team</h1>
        <div
          onClick={removeMember}
          className="border p-3 rounded-full min-w-[150px] text-center bg-giv-500 text-white font-bold cursor-pointer"
        >
          Remove
        </div>
      </div>

      <Input
        {...register(`team.${index}.name`)}
        placeholder="James Smith"
        className="border border-neutral-700 focus:ring-peach-400 focus:border-peach-400 outline-none"
      />
      <div>
        <h2 className="text-2xl">Social Media Links</h2>
        <p className="text-sm mt-2">
          <span className="text-neutral-300">
            Add your project's social media links (optional)
          </span>
        </p>
      </div>
      <div className="flex flex-col gap-6">
        {socialMediaLinks.map((socialMedia) => (
          <SocialMediaInput
            key={socialMedia.name}
            {...socialMedia}
            name={`team.${index}.${socialMedia.name}`}
          />
        ))}
      </div>
      <div className="flex flex-col gap-6 w-full mx-auto">
        <label className="text-4xl font-bold text-neutral-300">
          Upload an Avatar
        </label>
        <p>Displayed in the header of the project page.</p>
        <Dropzone name={`team.${index}.image`} onDrop={handleDrop} />
      </div>
    </section>
  );
};
