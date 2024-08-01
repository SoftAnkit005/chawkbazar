import ConfirmationCard from "@components/common/confirmation-card";
import {
  useModalAction,
} from "@components/ui/modal/modal.context";

const AccountDeleteView = () => {
  const { closeModal, openModal } = useModalAction();
  async function handleDelete() {
    closeModal();
    openModal("DELETE_ACCOUNT_CONFIRMED");
  }
  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
    />
  );
};

export default AccountDeleteView;
