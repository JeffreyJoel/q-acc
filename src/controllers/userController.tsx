'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter, usePathname } from 'next/navigation';
import { fetchGivethUserInfo } from '@/services/user.service';
import { SignModal } from '@/components/modals/SignModal';
import { EmailPromptDialog } from '@/components/modals/EmailPromptDialog';
// import { SanctionModal } from '../Modals/SanctionModal';
import { useUpdateUser } from '@/hooks/useUpdateUser';
import { getLocalStorageToken } from '@/helpers/generateJWT';
import { IUser, INewUer } from '@/types/user.type';
import { useFetchUser } from '@/hooks/useFetchUser';
import { Address } from 'viem';
import { useAccount } from 'wagmi';
// import { isProductReleased } from '@/config/configuration';
// import { useAddressWhitelist } from '@/hooks/useAddressWhitelist';
    // import { useFetchSanctionStatus } from '@/hooks/useFetchSanctionStatus';
    // import { useCheckSafeAccount } from '@/hooks/useCheckSafeAccount';
    // import { TermsConditionModal } from '../Modals/TermsConditionModal';

export const UserController = () => {
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [showEmailPromptModal, setShowEmailPromptModal] = useState(false);
  const { user: privyUser, ready, authenticated } = usePrivy();
  const { mutateAsync: updateUser } = useUpdateUser();
  const router = useRouter();
  const { isConnected, address } = useAccount();

  // const useWhitelist = useAddressWhitelist();
  const pathname = usePathname();
  const userAddress = address || privyUser?.wallet?.address;


  const { data: user, refetch } = useFetchUser(
    ready && authenticated && !!userAddress,
    userAddress as Address,
  );

  const onSign = async (signedInUser: IUser) => {
    console.log('Signed', signedInUser);
    router.push("/");
    setShowSignModal(false);
    if (!signedInUser?.isSignedIn) return;

    let currentUserState: IUser | null | undefined = (await refetch()).data;
    if (!currentUserState) {
      // If refetch fails, use the signedInUser data as a base, though it might be incomplete
      // or not reflect the true backend state accurately if only privy data.
      currentUserState = signedInUser;
    }

    if (userAddress && (!currentUserState?.fullName || !currentUserState?.email)) {
      const givethData = await fetchGivethUserInfo(userAddress);
      console.log('Giveth', givethData);

      if (givethData && (givethData.name || givethData.email)) {
        const userUpdateFromGiveth: INewUer = {
          fullName: givethData.name || currentUserState?.fullName || "",
          email: givethData.email || currentUserState?.email,
          avatar: givethData.avatar || currentUserState?.avatar,
          newUser: !currentUserState?.fullName || !currentUserState?.email,
        };

        await updateUser(userUpdateFromGiveth);
        // After update, refetch to get the consolidated IUser state
        const updatedUserData = await refetch();
        if (updatedUserData.data) {
            currentUserState = updatedUserData.data;
        } else {
            // If refetch fails, optimistically update local state with what we sent
            // This is a fallback and might not be perfectly accurate if backend did something else
            currentUserState = {
                ...currentUserState, // Spread existing IUser fields (like id, isSignedIn etc)
                fullName: userUpdateFromGiveth.fullName,
                email: userUpdateFromGiveth.email || "", // IUser expects email to be string
                avatar: userUpdateFromGiveth.avatar || "", // IUser expects avatar to be string
                // Note: other IUser fields remain from previous currentUserState
            } as IUser;
        }
        console.log('Giveth info saved');
      } else {
        console.log('No new user info in Giveth data');
      }
    }

    if (!currentUserState?.email) {
      setShowEmailPromptModal(true);
    }

    // if (!isProductReleased) {
    //   return redirect(Routes.KycLanding);
    // }

    // Check if user is whitelisted
    // if (!!useWhitelist.data) {
    //   const isUserCreatedProject = true;
    //   if (!isUserCreatedProject) {
    //     router.push(Routes.Create); //TODO: should we redirect or not
    //   }
    // }
  };

  useEffect(() => {
    if (!ready || !authenticated || !userAddress ) return;
    const handleAddressCheck = async () => {
      const localStorageToken = getLocalStorageToken(userAddress);

      // If token exists in local storage, refetch and skip modal
      if (localStorageToken) {
        await refetch();

        // Check if user has accepted ToS after refetching user data
        // if (user && !user.acceptedToS && pathname !== '/tos') {
        //   setShowTermsModal(true);
        // }
        return;
      }

      // Remove stale token if any
      localStorage.removeItem('token');

      setShowSignModal(true);
    };

    handleAddressCheck();
  }, [userAddress, refetch, user, pathname, ready, authenticated]);

  useEffect(() => {
    const handleShowSignInModal = () => {

      setShowSignModal(true);
    };

    window.addEventListener('showSignInModal', handleShowSignInModal);

    return () => {
      window.removeEventListener('showSignInModal', handleShowSignInModal);
    };
  }, []);

//   useEffect(() => {
//     if (isSanctioned) {
//       setShowSanctionModal(true);
//     }
//   }, [isSanctioned]);

//   const handleTermsClose = () => {
//     setShowTermsModal(false);
//     if (user?.fullName) {
//       router.push(Routes.VerifyPrivado);
//     } else {
//       setShowCompleteProfileModal(true);
//     }
//   };

  // Determine which modal to show based on priority
//   if (showSanctionModal) {
//     return (
//       <SanctionModal
//         isOpen={showSanctionModal}
//         onClose={() => setShowSanctionModal(false)}
//       />
//     );
//   }

  if (showSignModal) {
    return (
      <SignModal
        isOpen={true}
        onClose={() => setShowSignModal(false)}
        onSign={onSign}
      />
    );
  }

  if (showEmailPromptModal) {
    return (
      <EmailPromptDialog
        isOpen={showEmailPromptModal}
        onClose={() => {
          setShowEmailPromptModal(false);
          // Optionally refetch user data when dialog is closed without submission,
          // if there's a chance data could have changed by other means or to be safe.
          // refetch(); 
        }}
        currentUser={user}
      />
    );
  }

//   if (showTermsModal) {
//     return (
//       <TermsConditionModal isOpen={showTermsModal} onClose={handleTermsClose} />
//     );
//   }

//   if (showCompleteProfileModal) {
//     return (
//       <TermsConditionModal
//         isOpen={showCompleteProfileModal}
//         onClose={() => setShowCompleteProfileModal(false)}
//       />
//     );
//   }

  return null;
};
