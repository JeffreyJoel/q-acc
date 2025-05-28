'use client';

import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter, usePathname } from 'next/navigation';
import { fetchGivethUserInfo } from '@/services/user.service';
import { SignModal } from '@/components/modals/SignModal';
// import { SanctionModal } from '../Modals/SanctionModal';
import { useUpdateUser } from '@/hooks/useUpdateUser';
import { getLocalStorageToken } from '@/helpers/generateJWT';
import { IUser } from '@/types/user.type';
import { useFetchUser } from '@/hooks/useFetchUser';
import { Address } from 'viem';
// import { isProductReleased } from '@/config/configuration';
// import { useAddressWhitelist } from '@/hooks/useAddressWhitelist';
    // import { useFetchSanctionStatus } from '@/hooks/useFetchSanctionStatus';
    // import { useCheckSafeAccount } from '@/hooks/useCheckSafeAccount';
    // import { TermsConditionModal } from '../Modals/TermsConditionModal';

export const UserController = () => {
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const { user: privyUser, ready, authenticated } = usePrivy();
  const { mutateAsync: updateUser } = useUpdateUser();
  const router = useRouter();

  // const useWhitelist = useAddressWhitelist();
  const pathname = usePathname();
  const userAddress = privyUser?.wallet?.address;

  const { data: user, refetch } = useFetchUser(
    ready && authenticated && !!userAddress,
    userAddress as Address,
  );
  console.log("user", user);

  const onSign = async (newUser: IUser) => {
    console.log('Signed', newUser);
    router.push("/");
    setShowSignModal(false);
    if (!newUser?.isSignedIn) return;

    // Check if user has accepted ToS after signing in
    // if (!user?.acceptedToS && pathname !== '/tos') {
    //   setShowTermsModal(true);
    //   return;
    // }

    // Save user info to QAcc if user is Giveth user
    if (userAddress && !newUser?.fullName && !newUser?.email) {
      const givethData = await fetchGivethUserInfo(userAddress);
      console.log('Giveth', givethData);

      if (givethData && (givethData.name || givethData.email)) {
        const _user = {
          id: givethData.id,
          email: givethData.email || undefined,
          fullName: givethData.name,
          avatar: givethData.avatar,
          newUser: true,
        };

        await updateUser(_user);

        // Show terms modal if user hasn't accepted ToS
        // if (!user?.acceptedToS) {
        //   setShowTermsModal(true);
        // } else {
        //   router.push(Routes.VerifyPrivado);
        // }
        console.log('saved');
      } else {
        console.log('No user in giveth data');
        // setShowCompleteProfileModal(true);
      }
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
    if (!ready || !authenticated || !userAddress) return;
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
