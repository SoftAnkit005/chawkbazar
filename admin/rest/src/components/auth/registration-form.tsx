import Alert from "@components/ui/alert";
import Button from "@components/ui/button";
import Input from "@components/ui/input";
import PasswordInput from "@components/ui/password-input";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ROUTES } from "@utils/routes";
import { useTranslation } from "next-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "@components/ui/link";
import { allowedRoles, hasAccess, setAuthCredentials } from "@utils/auth-utils";
import { Permission } from "@ts-types/generated";
import { useRegisterMutation } from "@data/user/use-register.mutation";

type FormValues = {
	name: string;
	email: string;
	password: string;
	tnc: boolean;
	permission: Permission;
};
const registrationFormSchema = yup.object().shape({
	name: yup.string().required("form:error-name-required"),
	email: yup
		.string()
		.email("form:error-email-format")
		.required("form:error-email-required"),
	password: yup.string().required("form:error-password-required"),
	tnc: yup.boolean().required(),
	permission: yup.string().default("store_owner").oneOf(["store_owner"]),
});
const RegistrationForm = () => {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { mutate: registerUser, isLoading: loading } = useRegisterMutation();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const toggleModal = () => {
		setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
	  };  

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<FormValues>({
		resolver: yupResolver(registrationFormSchema),
		defaultValues: {
			permission: Permission.StoreOwner,
		},
	});
	const defaultValues: FormValues = {
		name: "",
		email: "",
		password: "",
		tnc: false,
		permission: Permission.StoreOwner,
	};

	const router = useRouter();
	const { t } = useTranslation();

	async function onSubmit({ name, email, tnc, password, permission }: FormValues) {
		registerUser(
			{
				variables: {
					name,
					email,
					tnc, 
					password,
					permission,
				},
			},

			{
				onSuccess: ({ data }) => {
					if (data?.token) {
						if (hasAccess(allowedRoles, data?.permissions)) {
							setAuthCredentials(data?.token, data?.permissions);
							router.push(ROUTES.DASHBOARD);
							return;
						}
						setErrorMessage("form:error-enough-permission");
					} else {
						setErrorMessage("form:error-credential-wrong");
					}
				},
				onError: (error: any) => {
					Object.keys(error?.response?.data).forEach((field: any) => {
						setError(field, {
							type: "manual",
							message: error?.response?.data[field],
						});
					});
				},
			}
		);
	}

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<Input
					label={t("form:input-label-name")}
					{...register("name")}
					variant="outline"
					className="mb-4"
					error={t(errors?.name?.message!)}
				/>
				<Input
					label={t("form:input-label-email")}
					{...register("email")}
					type="email"
					variant="outline"
					className="mb-4"
					error={t(errors?.email?.message!)}
				/>
				<PasswordInput
					label={t("form:input-label-password")}
					{...register("password")}
					error={t(errors?.password?.message!)}
					variant="outline"
					className="mb-4"
				/>
				<div>
				<label htmlFor="terms-and-conditions">
					<input					
					{...register("tnc")}
					type="checkbox"
					name="TandC"
					id="terms-and-conditions"
					onChange={toggleModal}
					className="form-checkbox text-accent h-4 w-4"
					/>
					<span className="ml-2 text-sm">Terms & Conditions</span>
				</label>
				</div>
				<br />

				 {/* Form Modal */}
				 {isModalOpen && (
				<div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50">
					<div className="bg-white p-4 rounded-lg shadow-lg max-w-md overflow-y-auto max-h-screen">
					<h2 className="text-lg font-semibold mb-2">Terms and Conditions for Zweler Gems Pvt Ltd </h2>


					<h2><strong>1. Introduction :- </strong></h2>

					<p>Welcome to Zweler Gems Pvt Ltd (referred to as "Zweler," "we," "us," or "our"). By accessing and using our website <strong><a href="www.zweler.com">www.zweler.com</a></strong> (the "Website"), you agree to comply with these Terms and Conditions ("Terms"). Please read these Terms carefully before using the Website. If you do not agree with these Terms, please refrain from using our services.</p> <br/>

					<h2><strong>2. Use of the Website :- </strong></h2>

					<p>
					<strong>2.1. Eligibility:</strong> By using the Website, you represent that you are of legal age to enter into a binding agreement and have the authority to do so on behalf of your business or organization.
					</p>
					<p>
					<strong>2.2. Account Registration:</strong> To access certain features and functionalities, you may be required to register for an account on our Website. You agree to provide accurate and up-to-date information during the registration process and keep your account credentials secure. You are responsible for all activities that occur under your account.
					</p>
					<p>
					<strong>2.3. Acceptable Use:</strong> You agree not to use the Website for any unlawful, abusive, or fraudulent purposes. You shall not engage in any activity that could harm the Website's integrity or interfere with other users' experiences.
					</p> <br/>

					<h2><strong>3. Goods Collection and Delivery :- </strong></h2>

					<p>
					<strong>3.1. Wholesale Collection and Distribution:</strong> Our Website serves as a B2B platform for the wholesale collection of goods from vendors and their distribution to customers. Zweler acts as an intermediary to facilitate these transactions.
					</p>
					<p>
					<strong>3.2. Vendor Obligations:</strong> Vendors are responsible for accurately describing the goods, ensuring their quality, and meeting delivery timelines. Zweler will review and verify vendor information but does not guarantee the accuracy of the descriptions or quality of goods.
					</p>
					<p>
					<strong>3.3. Customer Obligations:</strong> Customers are responsible for providing accurate delivery information, including shipping address and contact details. Any incorrect information may lead to delivery delays or failed deliveries.
					</p>
					<p>
					<strong>3.4. Order Processing:</strong> Zweler will process orders promptly and facilitate the collection of goods from vendors. We will strive to ensure timely delivery to customers. However, delivery timelines may vary based on factors beyond our control.
					</p>
					<p>
					<strong>3.5. Shipping and Delivery:</strong> Zweler will utilize reliable shipping services to deliver goods to customers. Once goods are handed over to the shipping carrier, delivery is subject to the carrier's terms and conditions.
					</p>
					<p>
					<strong>3.6. Loss or Damage:</strong> In the event of any loss or damage to goods during transit, customers are required to report the issue to Zweler promptly. We will assist in resolving such matters with the shipping carrier and the vendor.
					</p> <br />

					<h2><strong>4. Account Security and Confidentiality :- </strong></h2>

					<p>
					<strong>4.1. Security Measures:</strong> We employ reasonable security measures to protect your account information. However, you are responsible for safeguarding your login credentials and any activity that occurs under your account.
					</p>
					<p>
					<strong>4.2. Reporting Security Issues:</strong> If you suspect any unauthorized use of your account or become aware of any security vulnerabilities on the Website, please notify us immediately.
					</p> <br/>

					<h2><strong>5. Intellectual Property :- </strong></h2>

					<p>
					<strong>5.1. Ownership:</strong> All content and materials on the Website, including but not limited to text, graphics, logos, images, and software, are the property of Zweler Gems Pvt Ltd or its licensors and are protected by intellectual property laws.
					</p>
					<p>
					<strong>5.2. Limited License:</strong> You are granted a limited, non-exclusive, and non-transferable license to access and use the Website solely for legitimate B2B transactions.
					</p> <br/>

					<h2><strong>6. Privacy Policy :- </strong></h2>

					<p>Your use of the Website is subject to our Privacy Policy, which governs how we collect, use, and disclose your personal information. Please review our Privacy Policy for more information.</p> <br />

					<h2><strong>7. Limitation of Liability :- </strong></h2>

					<p>To the extent permitted by law, Zweler Gems Pvt Ltd shall not be liable for any direct, indirect, incidental, consequential, or exemplary damages arising from or in connection with the use of the Website or any transactions conducted through it.</p> <br />

					<h2><strong>8. Modification and Termination :- </strong></h2>

					<p>We reserve the right to modify, suspend, or terminate the Website or these Terms at any time without prior notice.</p> <br />

					<h2><strong>9. Governing Law and Jurisdiction :- </strong></h2>

					<p>These Terms shall be governed by and construed in accordance with the laws of Surat's Law Jurisdiction, and any disputes arising from these Terms or the use of the Website shall be subject to the exclusive jurisdiction of the courts of Surat Jurisdiction.</p> <br />



					<div className="flex justify-end">
					<button
						onClick={toggleModal}
						className="bg-accent text-white px-4 py-2 mt-4 rounded-md hover:bg-accent-hover focus:outline-none focus:bg-accent-hover"
					>
						Accept & Close
					</button>
					</div>

					</div>
				</div>
				)}

				<Button className="w-full" loading={loading} disabled={loading}>
					{t("form:text-register")}
				</Button>

				{errorMessage ? (
					<Alert
						message={t(errorMessage)}
						variant="error"
						closeable={true}
						className="mt-5"
						onClose={() => setErrorMessage(null)}
					/>
				) : null}
			</form>
			<div className="flex flex-col items-center justify-center relative text-sm text-heading mt-8 sm:mt-11 mb-6 sm:mb-8">
				<hr className="w-full" />
				<span className="absolute start-2/4 -top-2.5 px-2 -ms-4 bg-light">
					{t("common:text-or")}
				</span>
			</div>
			<div className="text-sm sm:text-base text-body text-center">
				{t("form:text-already-account")}{" "}
				<Link
					href={ROUTES.LOGIN}
					className="ms-1 underline text-accent font-semibold transition-colors duration-200 focus:outline-none hover:text-accent-hover focus:text-accent-hover hover:no-underline focus:no-underline"
				>
					{t("form:button-label-login")}
				</Link>
			</div>
		</>
	);
};

export default RegistrationForm;
