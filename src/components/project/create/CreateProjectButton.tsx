'use client';

import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { useAddressWhitelist } from '@/hooks/useAddressWhitelist';
import { Plus } from 'lucide-react';

interface CreateProjectButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export const CreateProjectButton: React.FC<CreateProjectButtonProps> = ({
  variant = 'default',
  size = 'default',
  className = '',
  children = 'Create Project',
  showIcon = false,
}) => {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { data: addrWhitelist } = useAddressWhitelist();

  const handleClick = () => {
    if (!isConnected) {
      // You could show a toast or modal here instead
      alert('Please connect your wallet to create a project');
      return;
    }
    
    if (!addrWhitelist) {
      alert('You need to be whitelisted to create a project');
      return;
    }

    router.push('/project/create');
  };

  // Don't show button if user can't create projects
  if (!isConnected || !addrWhitelist) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
    >
      {showIcon && <Plus size={16} className="mr-2" />}
      {children}
    </Button>
  );
}; 