"use client";

import {
  IProjectSocialMedia,
  EProjectSocialMediaType,
} from "@/types/project.type";
import { Globe } from "lucide-react";
import {
  IconBrandX,
  IconBrandGithub,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandLinkedin,
  IconBrandReddit,
  IconBrandDiscord,
  IconBrandTelegram,
} from "@tabler/icons-react";
import { IconFarcaster } from "../icons/IconFarcaster";
import  IconLens  from "../icons/IconLens";

interface SocialLinksProps {
  socialMedia?: IProjectSocialMedia[];
}

const socialIconMap: Record<
  EProjectSocialMediaType,
  { icon: React.ElementType; color: string }
> = {
  [EProjectSocialMediaType.WEBSITE]: { icon: Globe, color: "text-white" },
  [EProjectSocialMediaType.X]: { icon: IconBrandX, color: "text-white" },
  [EProjectSocialMediaType.GITHUB]: { icon: IconBrandGithub, color: "text-white" },
  [EProjectSocialMediaType.FACEBOOK]: { icon: IconBrandFacebook, color: "text-blue-600" },
  [EProjectSocialMediaType.INSTAGRAM]: { icon: IconBrandInstagram, color: "text-pink-500" },
  [EProjectSocialMediaType.YOUTUBE]: { icon: IconBrandYoutube, color: "text-red-600" },
  [EProjectSocialMediaType.LINKEDIN]: { icon: IconBrandLinkedin, color: "text-blue-700" },
  [EProjectSocialMediaType.REDDIT]: { icon: IconBrandReddit, color: "text-orange-500" },
  [EProjectSocialMediaType.DISCORD]: { icon: IconBrandDiscord, color: "text-indigo-500" },
  [EProjectSocialMediaType.TELEGRAM]: { icon: IconBrandTelegram, color: "text-blue-400" },
  [EProjectSocialMediaType.FARCASTER]: { icon: IconFarcaster, color: "text-purple-500" },
  [EProjectSocialMediaType.LENS]: { icon: IconLens, color: "text-green-500" },
};

export default function SocialLinks({ socialMedia }: SocialLinksProps) {
  if (!socialMedia || socialMedia.length === 0) {
    return null;
  }

  return (
    <div className="flex space-x-3 items-center">
      {socialMedia.map((social) => {
        const SocialIconComponent = socialIconMap[social.type]?.icon;
        const iconColor = socialIconMap[social.type]?.color || "text-white";

        if (!SocialIconComponent) {
          return null;
        }

        let iconRenderSize = 24;
        if (
          social.type === EProjectSocialMediaType.WEBSITE ||
          social.type === EProjectSocialMediaType.X
        ) {
          iconRenderSize = 20;
        }

        return (
          <a
            key={social.type}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-neutral-800 hover:bg-neutral-700 transition-colors p-3 rounded-full"
            aria-label={social.type}
          >
            <SocialIconComponent size={iconRenderSize} className={`${iconColor}`} />
          </a>
        );
      })}
    </div>
  );
} 