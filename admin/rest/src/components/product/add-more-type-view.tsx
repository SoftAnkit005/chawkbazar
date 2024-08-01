import Button from "@components/ui/button";
import { useModalAction } from "@components/ui/modal/modal.context";

const AddMoreTypeView = () => {
  const { closeModal, openModal } = useModalAction();
  let attrValue = JSON.parse(localStorage.getItem("selectedAttributeValue") || "{}");
  let groupValue = attrValue.split(" ").length > 1 ? attrValue.split(" ")[1] : attrValue;
  function yesClicked(){
    localStorage.setItem("justClosed","1");
    closeModal();
    return openModal("ADD_MORE_TYPE_FORM");
  }
  function noClicked(){
    localStorage.setItem("justClosed","1");
    return closeModal();
  }
    return (
      <div className="p-4 pb-6 bg-gray-100 bg-white m-auto max-w-sm w-full rounded-md md:rounded-xl sm:w-[24rem]">
      <div className="w-full h-full text-center">
        <div className="flex h-full flex-col justify-between">
      <span>What To Enter More Type For <br/> {groupValue} Type ? </span>
      <div className="row">
      <Button onClick={yesClicked} style={{width:"70px", textAlign:"right", marginTop:"20px", marginRight:"10px"}}>Yes</Button>
      <Button onClick={noClicked} style={{width:"70px", textAlign:"right", marginTop:"20px", marginLeft:"10px", backgroundColor:"red"}}>No</Button>
      </div>
      </div>
      </div>
      </div>
    );
  };
  
  export default AddMoreTypeView;
  