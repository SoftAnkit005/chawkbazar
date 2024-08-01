import ConfirmationCard from "@components/common/confirmation-card";
import {
  useModalAction,
  useModalState,
} from "@components/ui/modal/modal.context";
import { useDeleteMenuBuilderMutation } from "@data/menu-builder/menu-builder-delete.mutation";

const MenuBuilderDeleteView = () => {
  const { mutate: deleteMenuBuilder, isLoading: loading } =
  useDeleteMenuBuilderMutation();
  const { data } = useModalState();
  const { closeModal } = useModalAction();
  async function handleDelete() {
    deleteMenuBuilder(data);
    closeModal();
  }
  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default MenuBuilderDeleteView;
