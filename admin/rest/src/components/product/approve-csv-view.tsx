import ConfirmationApproveCard from "@components/common/confirmation-approve-card";
import {
  useModalAction, useModalState,
} from "@components/ui/modal/modal.context";
import { useApproveSolitaireCsvMutation } from "@data/product/approve-solitaire-csv.mutation";

const ApproveCsvView = () => {
  const { closeModal } = useModalAction();
  const { data } = useModalState();
  const { mutate: approveSolitaireCsvMutation } =
    useApproveSolitaireCsvMutation();
  async function handleApprove() {
    approveSolitaireCsvMutation(data);
    closeModal();
  }
  return (
    <ConfirmationApproveCard
      onCancel={closeModal}
      onApprove={handleApprove}
    />
  );
};

export default ApproveCsvView;
