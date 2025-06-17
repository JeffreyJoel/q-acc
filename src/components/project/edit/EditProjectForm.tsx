"use client";

import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState, type FC } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Input } from "@/components/ui/input";
import { Dropzone } from "@/components/ui/dropzone";
import { Textarea } from "@/components/ui/textarea";
import { SocialMediaInput } from "@/components/project/create/SocialMediaInput";
import { validators } from "@/components/project/create/validators";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { useProjectCreationContext } from "@/contexts/projectCreation.context";
import {
  EProjectSocialMediaType,
  ProjectFormData,
  IProjectSocialMedia,
} from "@/types/project.type";
import { TeamMember } from "@/types/project.type";
import { IconArrowRight } from "@tabler/icons-react";
import { Address } from "viem";

const socialMediaLinks = [
  {
    name: EProjectSocialMediaType.WEBSITE,
    label: "Website",
    iconName: "web.svg",
    rules: validators.website,
  },
  {
    name: EProjectSocialMediaType.FACEBOOK,
    label: "Facebook",
    iconName: "facebook.svg",
    rules: validators.facebook,
  },
  {
    name: EProjectSocialMediaType.X,
    label: "Twitter",
    iconName: "twitter.svg",
    rules: validators.twitter,
  },
  {
    name: EProjectSocialMediaType.LINKEDIN,
    label: "LinkedIn",
    iconName: "linkedin.svg",
    rules: validators.linkedin,
  },
  {
    name: EProjectSocialMediaType.DISCORD,
    label: "Discord",
    iconName: "discord.svg",
    rules: validators.discord,
  },
  {
    name: EProjectSocialMediaType.TELEGRAM,
    label: "Telegram",
    iconName: "telegram.svg",
    rules: validators.telegram,
  },
  {
    name: EProjectSocialMediaType.INSTAGRAM,
    label: "Instagram",
    iconName: "instagram.svg",
    rules: validators.instagram,
  },
  {
    name: EProjectSocialMediaType.REDDIT,
    label: "Reddit",
    iconName: "reddit.svg",
    rules: validators.reddit,
  },
  {
    name: EProjectSocialMediaType.YOUTUBE,
    label: "YouTube",
    iconName: "youtube.svg",
    rules: validators.youtube,
  },
  {
    name: EProjectSocialMediaType.FARCASTER,
    label: "Farcaster",
    iconName: "farcaster.svg",
    rules: validators.farcaster,
  },
  {
    name: EProjectSocialMediaType.LENS,
    label: "Lens",
    iconName: "lens.svg",
    rules: validators.lens,
  },
  {
    name: EProjectSocialMediaType.GITHUB,
    label: "GitHub",
    iconName: "github.svg",
    rules: validators.github,
  },
];

interface EditProjectFormProps {
  projectId: string;
}

const EditProjectForm: FC<EditProjectFormProps> = ({ projectId }) => {
  const { address } = useAccount();
  const { formData, setFormData, isLoading, projectData, isEditMode } =
    useProjectCreationContext();
  const methods = useForm<ProjectFormData>({ mode: "onChange" });
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = methods;
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0 && 'projectName' in formData) {
      reset(formData as ProjectFormData);
    }
  }, [formData, reset]);

  const handleDrop = (name: string, file: File, ipfsHash: string) => {
    // Implement logic to handle file drops, possibly updating form state
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (!address) return;
    setFormData({
      ...data,
      team: formData.team || [],
    });
    router.push(`/project/edit/${projectId}/team`);
  };

  console.log(formData);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container mx-auto bg-neutral-800 w-full flex flex-col gap-16 pt-10 mt-28 rounded-2xl p-8">
          <div className="flex flex-row justify-between">
            <h1 className="text-2xl font-bold text-white mb-7">
              Edit Your Project
            </h1>

            <div className="flex flex-row items-center gap-6">
              <span className="font-bold ">Next: Edit your team</span>
              <button
                className="bg-peach-400 text-black p-3 shadow-2xl rounded-full text-xs md:text-md min-w-[150px] flex items-center justify-center gap-2 hover:bg-peach-300"
                type="submit"
              >
                Save & continue
                <IconArrowRight width={20} height={20} />
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm mb-2 text-neutral-300">
              Project Name
            </label>
            <Input
              {...register("projectName", {
                required: "Project name is required",
                minLength: {
                  value: 3,
                  message: "Project name must be at least 3 characters",
                },
              })}
              placeholder="My First Project"
              className="mt-2 border border-neutral-500 focus:ring-peach-400 focus:border-peach-400 outline-none"
            />
            {errors.projectName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.projectName.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm mb-2 text-neutral-300">
              Project Teaser
            </label>
            <Textarea
              {...register("projectTeaser", {
                required: "Project teaser is required",
                maxLength: {
                  value: 100,
                  message: "Teaser must be 100 characters or less",
                },
              })}
              placeholder="Enter project teaser"
              maxLength={100}
              rows={6}
              className="mt-2 border border-neutral-500 focus:ring-peach-400 focus:border-peach-400 outline-none"
            />
            {errors.projectTeaser && (
              <p className="text-red-500 text-sm mt-1">
                {errors.projectTeaser.message}
              </p>
            )}
          </div>

          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl">Tell us about your project...</h2>
              <p className="text-sm mt-2">
                <span className="text-neutral-300">Aim for 200-500 words.</span>
              </p>
            </div>
            <RichTextEditor
              name="projectDescription"
              rules={{
                required: "Project description is required",
                minLength: {
                  value: 200,
                  message:
                    "Project description must be at least 200 characters",
                },
              }}
              defaultValue={projectData?.description || ""}
              maxLength={500}
            />
          </section>

          <section className="flex flex-col gap-6">
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
                <SocialMediaInput key={socialMedia.name} {...socialMedia} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-6 w-full mx-auto">
            <label className="text-4xl font-bold text-neutral-300">
              Upload Logo
            </label>
            <p>Displayed in the header of the project page.</p>
            <Dropzone name="logo" onDrop={handleDrop} />
          </section>

          <section className="flex flex-col gap-6 w-full mx-auto">
            <label className="text-4xl font-bold text-neutral-300">
              Add an image to your project
            </label>
            <p>Displayed in the header of the project page.</p>
            <Dropzone name="banner" onDrop={handleDrop} />
          </section>
        </div>
      </form>
    </FormProvider>
  );
};

export default EditProjectForm;
