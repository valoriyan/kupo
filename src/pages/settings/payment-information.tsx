import Head from "next/head";
import { AppLayout } from "#/components/AppLayout";
import { NestedPageLayout } from "#/components/NestedPageLayout";
import { ProtectedPage } from "#/contexts/auth";
import { PaymentInformation } from "#/templates/Settings/PaymentInformation";
import { getSettingsCloseHref } from ".";

const PaymentInformationSettingsPage = ProtectedPage(() => {
  return (
    <>
      <Head>
        <title>Payment Information Settings / Kupo</title>
      </Head>
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
