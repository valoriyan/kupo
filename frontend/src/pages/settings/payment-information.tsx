import Head from "next/head";
import Script from "next/script";
import { AppLayout } from "#/components/AppLayout";
import { NestedPageLayout } from "#/components/NestedPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { useSecurion } from "#/contexts/securion";
import { PaymentInformation } from "#/templates/Settings/PaymentInformation";
import { getSettingsCloseHref } from ".";

const PaymentInformationSettingsPage = ProtectedPage(() => {
  return (
    <>
      <Head>
        <title>Payment Information Settings / Kupo</title>
      </Head>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src="https://js.securionpay.com/v2/securionpay.js"
        onLoad={() => {
          useSecurion.getState().setSecurion(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).SecurionPay("pk_test_Khw9bBVopDxNgJJrd8WnSkxk"), // TODO: Get key from env vars
          );
        }}
      />
      <PaymentInformation />
    </>
  );
});

PaymentInformationSettingsPage.getLayout = (page) => {
  return (
    <AppLayout>
      <NestedPageLayout
        heading="Settings - Payment Information"
        closeHref={getSettingsCloseHref()}
        backHref="/settings"
      >
        {page}
      </NestedPageLayout>
    </AppLayout>
  );
};

export default PaymentInformationSettingsPage;
