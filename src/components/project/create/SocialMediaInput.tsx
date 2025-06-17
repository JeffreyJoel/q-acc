'use client';

import Image from 'next/image';
import { FC } from 'react';
import { type RegisterOptions, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface SocialMediaInputProps {
  name: string;
  label: string;
  iconName: string;
  placeholder?: string;
  rules?: RegisterOptions;
}

export const SocialMediaInput: FC<SocialMediaInputProps> = ({
  name,
  label,
  iconName,
  placeholder,
  rules,
}) => {
  const { register } = useFormContext();

  return (
    <div className='flex gap-12 items-center '>
      <div className='flex gap-2 items-center mb-2 w-36'>
        <Image
          src={`/images/icons/social/${iconName}`}
          alt={`${label} icon`}
          width={24}
          height={24}
          className="filter invert"
        />
        <label>{label}</label>
      </div>
      <div className='w-full'>
        <Input 
          {...register(name, rules)} 
          placeholder={placeholder}
          className="border border-neutral-700 focus:ring-peach-400 focus:border-peach-400 outline-none"
        />
      </div>
    </div>
  );
};
