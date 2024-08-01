import { getLayout } from "@components/layout/layout";
import Container from "@components/ui/container";
import PageHeader from "@components/ui/page-header";
// import { Link, Element } from "react-scroll";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { QueryClient } from "react-query";
import { API_ENDPOINTS } from "@framework/utils/endpoints";
import { fetchSettings } from "@framework/settings/settings.query";
// import { ReturnBuyPolicy } from "@settings/returnBuy-settings";

function makeTitleToDOMId(title: string) {
  return title.toLowerCase().split(" ").join("_");
}

export default function ReturnBuyPage() {
  const { t } = useTranslation("returnBuy");
  return (
    <>
      <PageHeader pageHeader="text-page-Return-Buy-policy" />
      <div className="mt-12 lg:mt-14 xl:mt-16 lg:py-1 xl:py-0 border-b border-gray-300 px-4 md:px-10 lg:px-7 xl:px-16 2xl:px-24 3xl:px-32 pb-9 md:pb-14 lg:pb-16 2xl:pb-20 3xl:pb-24">
        <Container>
          <div className="flex flex-col md:flex-row">
          <nav className="md:w-72 xl:w-3/12 mb-8 md:mb-0">
            <img src="./assets/images/abtimg.jpg" alt="About Us" className="w-full h-auto" />
              <ol className="sticky md:top-16 lg:top-28 z-10">
                {/* Navigation links */}
              </ol>
            </nav>
            <div className="md:w-9/12 ltr:md:pl-8 rtl:md:pr-8 pt-0 lg:pt-2">
              
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">How do I return the product to Zweler within 30 days? (For Consumers Only)</h2>
                <ol className="list-decimal list-inside pl-6">
                  <li className="mb-2">
                    Call our customer service team and you will be given a Return Authorization Code, once you let us know the item you would like to return along with your Order No.
                  </li>
                  <li className="mb-2">
                    We will assign a logistics partner for the pick up and you can dispatch the same with the Return Authorization code, your Name and Address on the outside.
                  </li>
                  <li className="mb-2">
                    The return courier charges are to be borne by the sender.
                  </li>
                  <li>
                    Once your returned item is received by Zweler, and the inspection approves the product, your Refund or New Item will be processed shortly.
                  </li>
                </ol>
              </div>
              <br />

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Lifetime Exchange & Buy-Back Policy</h2>
                <p>
                  We offer a Lifetime Exchange & Buy-Back Policy on all purchases* made from Zweler, within India. The product along with the original product certificate can be returned for Buy-Back or Exchanged basis its current market value, with deductions towards Making Charges, GST and Rs.500 towards processing charges. If you received a discount or free gift while making your purchase, we will deduct the original discount amount or free gift value, as applicable.
                </p>
              </div>
              <br />

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Return/Buy Back Policy for Consumer (In Numbers)</h2>
                <ul className="list-disc list-inside pl-6">
                  <li className="mb-2">
                    In Buy Back of Diamond Jewellery, 20% of the Diamond Price, Making Charges and GST shall be deducted. Gold shall be valued at the ongoing market value as per the purity of the metal in the product.
                  </li>
                  <li className="mb-2">
                    In Exchange of Diamond Jewellery, 10% of the Diamond Price, Making Charges and GST shall be deducted. Gold shall be valued at the ongoing market value as per the purity of the metal in the product.
                  </li>
                  <li>
                    In Gold/Silver Jewellery, the melting value of the product shall be as per the mentioned Karat and payable by the company. For 14KT @58%, 18KT @75%, and 22KT @91.50%.
                  </li>
                </ul>
              </div>
              <br />
              

              {/* Your existing sections */}
              
              {/* Adding the table */}
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-3 px-4 border border-gray-300 text-left">CATEGORY</th>
                    <th className="py-3 px-4 border border-gray-300 text-left">EXCHANGE VALUE</th>
                    <th className="py-3 px-4 border border-gray-300 text-left">BUYBACK VALUE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-gray-100">
                    <td className="py-3 px-4 border border-gray-300">Diamond & Gemstone Jewellery</td>
                    <td className="py-3 px-4 border border-gray-300">
                      100% of gold/platinum value at current market rate as per the purity of the metal.
                    </td>
                    <td className="py-3 px-4 border border-gray-300">
                      100% of gold/platinum value at current market rate as per the purity of the metal.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 border border-gray-300"></td>
                    <td className="py-3 px-4 border border-gray-300">
                      90% of diamond/gemstone value at the billing rate.
                    </td>
                    <td className="py-3 px-4 border border-gray-300">
                      80% of diamond/gemstone value at the billing rate.
                    </td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="py-3 px-4 border border-gray-300">Plain Gold /Platinum jewellery</td>
                    <td className="py-3 px-4 border border-gray-300">
                      100% of gold/platinum value at current market rate as per the purity of the product.
                    </td>
                    <td className="py-3 px-4 border border-gray-300">
                      100% of gold/platinum value at current market rate as per the purity of the product.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 border border-gray-300">Coins</td>
                    <td className="py-3 px-4 border border-gray-300">
                      100% of gold/silver value at current market rate as per the purity of the product.
                    </td>
                    <td className="py-3 px-4 border border-gray-300">
                      100% of gold/silver value at current market rate as per the purity of the product.
                    </td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="py-3 px-4 border border-gray-300">Solitaire Jewellery & Loose Solitaires</td>
                    <td className="py-3 px-4 border border-gray-300">
                      100% of gold/platinum value at current market rate as per the purity of the product.
                    </td>
                    <td className="py-3 px-4 border border-gray-300">
                      100% of gold/platinum value at current market rate as per the purity of the product.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 border border-gray-300"></td>
                    <td className="py-3 px-4 border border-gray-300">
                      90% of diamond/gemstone value at current market rate.
                    </td>
                    <td className="py-3 px-4 border border-gray-300">
                      80% of diamond/gemstone value at current market rate.
                    </td>
                  </tr>
                </tbody>
              </table>

              <br />
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Additional Information for Lifetime Exchange and Buy-Back</h2><br />
                <p>
                  <strong>Lifetime Exchange:</strong> The value of the exchanged product after deductions towards making charges and discounts will be credited to your Zweler account. This remains valid for 365 days and can be used to purchase anything (except Coins and Solitaires) on our website. The value cannot be encashed.
                </p>
                <p>
                  <strong>Lifetime Buy-Back:</strong> If you choose to return the product for buyback, the buy-back value will be paid to you via online bank transfer within 10 days of receipt of the product.
                </p>
                <p>
                  Jewellery returned showing signs of alteration by anyone other than Zweler shall not be accepted for return. Based on our quality inspection, we reserve the right to change the Exchange and Buy-Back amount of the product. Also, the exchange and buy back value of damaged products will be ascertained only after inspection by our quality team.
                </p>
              </div>
              <br />

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Important Notes and Contact Information</h2>
                <p>
                  <strong>Note:</strong> Loss of the original product certificate would result in a deduction of Rs. 1000.
                </p>
                <p>
                  <strong>Transit Insurance:</strong> All goods will be fully insured by Zweler until they reach you, so your purchase is 100% safe.
                </p>
                <p>
                  <strong>Customer Service:</strong> We are always open to your valuable suggestions. If there’s anything we need to improve upon, we would love to hear from you.
                </p>
                <p>
                  We can be reached at <a href="mailto:info@zweler.com"><strong>info@zweler.com</strong></a> or at <a href="tel:+919624177111"><strong>+91 96241-77111</strong></a> between 9 am-7 pm, from Monday to Saturday.
                </p>
                <p>
                  <strong>Our registered office address is:</strong><br />
                  <strong>Zweler Gems Pvt. Ltd.</strong><br />
                  <strong>Address :-</strong> 224, 2nd Floor, Zenon, Khatodara, Bamroli Road, Surat, Gujarat 395002, India.<br />
                  <strong>Contact Number :-</strong> +91 96240-77111 / +91 96241-77111
                </p>
              </div>

              
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

ReturnBuyPage.getLayout = getLayout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(API_ENDPOINTS.SETTINGS, fetchSettings);

  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        "common",
        "menu",
        "forms",
        "footer",
        "returnBuy",
      ])),
    },
  };
};
