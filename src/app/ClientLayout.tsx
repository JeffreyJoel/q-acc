'use client';
import { ParaProviders } from '@/providers/ParaProvider';
import { NavBar } from '@/components/shared/NavBar';
import { ExternalWallet, OAuthMethod, ParaModal } from "@getpara/react-sdk";
import { para } from "@/client/para";
import "@getpara/react-sdk/styles.css";
export default function ClientLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <ParaProviders>
      <NavBar/>
      <div>{children}</div>
      <ParaModal
        para={para}
        authLayout={["EXTERNAL:FULL", "AUTH:FULL"]}
        oAuthMethods={[OAuthMethod.GOOGLE, OAuthMethod.TWITTER]}
        externalWallets={[
          ExternalWallet.METAMASK,
          ExternalWallet.COINBASE,
          ExternalWallet.WALLETCONNECT,
          ExternalWallet.RAINBOW,
          ExternalWallet.ZERION,
          ExternalWallet.RABBY,
        ]}
        theme={{
          foregroundColor: "#FFFFFF",
          backgroundColor: "#171717",
          accentColor: "#FBBA80",
          mode: "dark",
          borderRadius: "full",
          font: "Inter",
        }}
        appName="Quadratic Acceleration"
        logo="/images/logos/logo-light.png"
        recoverySecretStepEnabled
        onRampTestMode={true}
      />
    </ParaProviders>
  );
}