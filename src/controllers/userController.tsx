"use client";

import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter, usePathname } from "next/navigation";
import { fetchGivethUserInfo } from "@/services/user.service";
// import { SanctionModal } from '../Modals/SanctionModal';
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { getLocalStorageToken } from "@/helpers/generateJWT";
import { IUser, INewUer } from "@/types/user.type";
import { useFetchUser } from "@/hooks/useFetchUser";
import { Address } from "viem";
import { useAccount } from "wagmi";
// import { isProductReleased } from '@/config/configuration';
import { useAddressWhitelist } from "@/hooks/useAddressWhitelist";
import { useModal } from "@/contexts/ModalContext";
// import { useFetchSanctionStatus } from '@/hooks/useFetchSanctionStatus';
// import { useCheckSafeAccount } from '@/hooks/useCheckSafeAccount';
// import { TermsConditionModal } from '../Modals/TermsConditionModal';

export const UserController = () => {
  const { user: privyUser, ready, authenticated } = usePrivy();
  const { mutateAsync: updateUser } = useUpdateUser();
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { setShowSignModal, openUpdateProfileModal, openSignModal, setOnSign } =
    useModal();

  const { data: useWhitelist } = useAddressWhitelist();
  const pathname = usePathname();
  const userAddress = address || privyUser?.wallet?.address;

  const { data: user, refetch } = useFetchUser(
    ready && authenticated && !!userAddress,
    userAddress as Address
  );

  const onSign = async (signedInUser: IUser) => {
    console.log("Signed", signedInUser);
    // router.push("/");
    setShowSignModal(false);
    if (!signedInUser?.isSignedIn) return;

    let currentUserState: IUser | null | undefined = (await refetch()).data;
    if (!currentUserState) {
      currentUserState = signedInUser;
    }

    if (
      userAddress &&
      (!currentUserState?.fullName || !currentUserState?.email)
    ) {
      const givethData = await fetchGivethUserInfo(userAddress);
      console.log("Giveth", givethData);

      if (givethData && (givethData.name || givethData.email)) {
        const userUpdateFromGiveth: INewUer = {
          fullName: givethData.name || currentUserState?.fullName || "",
          email: givethData.email || currentUserState?.email,
          avatar: givethData.avatar || currentUserState?.avatar,
          newUser: !currentUserState?.fullName || !currentUserState?.email,
        };

        await updateUser(userUpdateFromGiveth);
        const updatedUserData = await refetch();
        if (updatedUserData.data) {
          currentUserState = updatedUserData.data;
        } else {
          currentUserState = {
            ...currentUserState,
            fullName: userUpdateFromGiveth.fullName,
            email: userUpdateFromGiveth.email || "",
            avatar: userUpdateFromGiveth.avatar || "",
          } as IUser;
        }
        console.log("Giveth info saved");
      } else {
        console.log("No new user info in Giveth data");
      }
    }

    if (!currentUserState?.email) {
      openUpdateProfileModal(currentUserState, true);
    }

    // if (!isProductReleased) {
    //   return redirect(Routes.KycLanding);
    // }

    // Check if user is whitelisted
    if (!!useWhitelist) {
      const isUserCreatedProject = true;
      if (!isUserCreatedProject) {
        // router.push(Routes.Create); //TODO: should we redirect or not
      }
    }
  };

  // Set up the onSign callback when component mounts
  useEffect(() => {
    setOnSign(() => onSign);
  }, [setOnSign]);

  useEffect(() => {
    if (!ready || !authenticated || !userAddress) return;
    const handleAddressCheck = async () => {
      const localStorageToken = getLocalStorageToken(userAddress);

      if (localStorageToken) {
        await refetch();

        // Check if user has accepted ToS after refetching user data
        // if (user && !user.acceptedToS && pathname !== '/tos') {
        //   setShowTermsModal(true);
        // }
        return;
      }
      // Remove stale token if any
      localStorage.removeItem("token");

      openSignModal();
    };

    handleAddressCheck();
  }, [
    userAddress,
    user,
    ready,
    authenticated
  ]);

  // useEffect(() => {
  //   const handleShowSignInModal = () => {
  //     openSignModal();
  //   };

  //   window.addEventListener("showSignInModal", handleShowSignInModal);

  //   return () => {
  //     window.removeEventListener("showSignInModal", handleShowSignInModal);
  //   };
  // }, [openSignModal, openUpdateProfileModal, user]);

  return null;
};
