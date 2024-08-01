import Image from "next/image";
import { CheckMarkFill } from "@components/icons/checkmark-circle-fill";
import { CloseFillIcon } from "@components/icons/close-fill";
import { useTranslation } from "next-i18next";
import Link from "@components/ui/link";
import { ROUTES } from "@utils/routes";
import Loader from "@components/ui/loader/loader";
import { useMeQuery } from "@data/user/use-me.query";
import { useModalAction } from "@components/ui/modal/modal.context";

const UserDetails: React.FC = () => {
  const { t } = useTranslation("common");
  const { data, isLoading: loading } = useMeQuery();
  if (loading) return <Loader text={t("text-loading")} />;
  const { openModal } = useModalAction();
  function handleDelete() {
    openModal("DELETE_ACCOUNT",1);
  }

  const { name, email, profile, is_active } = data!;

  return (
    <div className="h-full p-5 flex flex-col items-center">
      {
        data?.email == "zweler.web@gmail.com" ?
      <div className="w-32 h-32 relative rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
        <Image
          src={profile?.avatar?.thumbnail ?? "/avatar-placeholder.svg"}
          layout="fill"
        />
      </div> : ""
}
      <h3 className="text-lg font-semibold text-heading mt-4">{name}</h3>
      <p className="text-sm text-muted mt-1">{email}</p>
      {!profile ? (
        <p className="text-sm text-muted mt-0.5">
          {t("text-add-your")}{" "}
          <Link href={ROUTES.PROFILE_UPDATE} className="text-accent underline">
            {t("authorized-nav-item-profile")}
          </Link>
        </p>
      ) : (
        <>
          <p className="text-sm text-muted mt-0.5">{profile.contact}</p>
        </>
      )}
      <div className="border border-gray-200 rounded flex items-center justify-center text-sm text-body-dark py-2 px-3 mt-6">
        {is_active ? (
          <CheckMarkFill width={16} className="me-2 text-accent" />
        ) : (
          <CloseFillIcon width={16} className="me-2 text-red-500" />
        )}
        {is_active ? "Enabled" : "Disabled"}
      </div>
      <button style={{background:"red", margin:"20px", padding:"10px", color:"white", borderRadius:"5px", fontSize:"12px"}} onClick={handleDelete}>Delete Account</button>
    </div>
  );
};
export default UserDetails;
