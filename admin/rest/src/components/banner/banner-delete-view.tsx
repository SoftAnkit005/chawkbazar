import ConfirmationCard from "@components/common/confirmation-card";
import {
  useModalAction,
  useModalState,
} from "@components/ui/modal/modal.context";
import { useDeleteBannerMutation } from "@data/banner/banner-delete.mutation";

const BannerDeleteView = () => {
  const { mutate: deleteBanner, isLoading: loading } =
  useDeleteBannerMutation();
  const { data } = useModalState();
  const { closeModal } = useModalAction();
  async function handleDelete() {
    deleteBanner(data);
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

export default BannerDeleteView;
