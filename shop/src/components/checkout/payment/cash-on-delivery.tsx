import { useTranslation } from "next-i18next";

const CashOnDelivery = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <span className="text-sm text-body block">{t("text-cod-message")}</span>
      <br/>
      <h1>Zweler Gems Pvt Ltd.</h1>
      <h1>Bank Name : HDFC Bank</h1>
      <h1>Branch : Raghunandan Market, Ring Road, Surat</h1>
      <h1>A/C No. : 50200059972125</h1>
      <h1>IFSC : HDFC0001416</h1>
      <br/>
      <img src="../../assets/images/zweler-upi.jpeg" alt="Zweler UPI QR" className="gif-image" />
    </>
  );
};
export default CashOnDelivery;
