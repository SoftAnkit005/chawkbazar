import CashOnDelivery from "@components/checkout/payment/cash-on-delivery";
import StripePayment from "@components/checkout/payment/stripe";
import Alert from "@components/ui/alert";
import useUser from "@framework/auth/use-user";
import { RadioGroup } from "@headlessui/react";
import { paymentGatewayAtom, PaymentMethodName } from "@store/checkout";
import cn from "classnames";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import { useState } from "react";
interface PaymentMethodInformation {
  name: string;
  value: PaymentMethodName;
  icon: string;
  component: React.FunctionComponent;
}
const AVAILABLE_PAYMENT_METHODS_MAP: Record<
  PaymentMethodName,
  PaymentMethodInformation
> = {
  CASH_ON_DELIVERY: {
    name: "Book Order",
    value: "CASH_ON_DELIVERY",
    icon: "",
    component: CashOnDelivery,
  },
};
const AVAILABLE_B2C_PAYMENT_METHODS_MAP: Record<
  PaymentMethodName,
  PaymentMethodInformation
> = {
};


const PaymentGrid: React.FC<{ className?: string }> = ({ className }) => {
	const { me } = useUser();
  const [gateway, setGateway] = useAtom<PaymentMethodName>(paymentGatewayAtom);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation("common");
  const PaymentMethod = (!me.customer_type && !me.business_profile) ? AVAILABLE_B2C_PAYMENT_METHODS_MAP[gateway] : AVAILABLE_PAYMENT_METHODS_MAP[gateway];
  const Component = PaymentMethod?.component ?? StripePayment;
  return (
    <div className={className}>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}

      <RadioGroup value={gateway} onChange={setGateway}>
        <RadioGroup.Label className="text-base text-heading font-semibold mb-5 block">
          {t("text-choose-payment")}
        </RadioGroup.Label>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 mb-6">
          {Object.values((!me.customer_type && !me.business_profile) ? AVAILABLE_B2C_PAYMENT_METHODS_MAP : AVAILABLE_PAYMENT_METHODS_MAP).map(
            ({ name, icon, value }) => (
              <RadioGroup.Option value={value} key={value}>
                {({ checked }) => (
                  <div
                    className={cn(
                      "w-full h-full py-3 flex items-center justify-center border text-center rounded cursor-pointer relative",
                      checked
                        ? "bg-white border-gray-600"
                        : "bg-white border-gray-600 shadow-600"
                    )}
                  >
                    {icon ? (
                      <>
                        {/* eslint-disable */}
                        <img src={icon} alt={name} className="h-[30px]" />
                      </>
                    ) : (
                      <span className="text-xs text-heading font-semibold">
                        {name}
                      </span>
                    )}
                  </div>
                )}
              </RadioGroup.Option>
            )
          )}
        </div>
      </RadioGroup>
      <div>
        <Component />
      </div>
    </div>
  );
};

export default PaymentGrid;
