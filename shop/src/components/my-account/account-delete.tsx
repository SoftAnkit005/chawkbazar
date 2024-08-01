import Confirmation from "@components/ui/cards/confirmation";
import { useUI } from "@contexts/ui.context";

const DeleteAccount = () => {
  const { openModal, setModalView, closeModal } = useUI();
  async function handleDelete() {
    closeModal();
    setModalView("DELETE_ACCOUNT_CONFIRMED_VIEW");
  return openModal();
  }
    return (
        <Confirmation
      onCancel={closeModal}
      onDelete={handleDelete}
    />
    )
}

export default DeleteAccount;
