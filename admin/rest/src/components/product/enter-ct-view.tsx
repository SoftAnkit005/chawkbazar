import Button from "@components/ui/button";
import Input from "@components/ui/input";
import { useModalAction } from "@components/ui/modal/modal.context";

const EnterCtView = () => {
  const { closeModal, openModal } = useModalAction();
  let attrName = localStorage.getItem("selectedAttributeName") || "";
  let typeOfProduct = localStorage.getItem("typeOfProduct") || "";
  function okClicked(){
    if(["Gold","Silver","Platinum","Precious Stones"].includes(attrName) || ["LOOSE DIAMOND","LABGROWN LOOSE DIAMOND","POLKI JEWELLERY"].includes(typeOfProduct)){
      localStorage.setItem("justClosed","1");
      return closeModal();      
    }
    else{
      localStorage.setItem("justClosed","1");
      closeModal();
      return openModal("ADD_MORE_TYPE");
    }
  }
  let attrValue = localStorage.getItem("selectedAttributeValue") || "";
  localStorage.setItem(attrValue.replaceAll(" ",""),"0");
  function enteredCt(event:any){
      localStorage.setItem(attrValue.replaceAll(" ",""),event.target.value);
  }
    return (
      <div className="p-4 pb-6 bg-gray-100 bg-white m-auto max-w-sm w-full rounded-md md:rounded-xl sm:w-[24rem]">
      <div className="w-full h-full text-center">
        <div className="flex h-full flex-col justify-between">
      <span>Enter { ["Gold","Silver","Platinum"].includes(attrName) ? ' Gr. Wt. (Gms) ' : ( attrName == 'Diamond' ? ' Diam Wt. (Ct) ' : ' Stone Wt. (Ct) ' ) } For <br/> {attrValue} </span>
      <Input
      name={"weight"}
                          type="text"
                          variant="outline"
						  defaultValue={0}
              onBlur={enteredCt}
                        />
      <div className="row">
                        <Button onClick={okClicked} style={{width:"70px", textAlign:"right", marginTop:"20px"}}>Ok</Button>
                        </div>
      </div>
      </div>
      </div>
    );
  };
  
  export default EnterCtView;
  