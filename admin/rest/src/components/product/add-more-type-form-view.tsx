import Button from "@components/ui/button";
import { useModalAction } from "@components/ui/modal/modal.context";
import { useAttributesQuery } from "@data/attributes/use-attributes.query";

const AddMoreTypeView = () => {
  const { data, isLoading } = useAttributesQuery({});
  const { openModal, closeModal } = useModalAction();
  let attrValue = JSON.parse(localStorage.getItem("selectedAttributeValue") || "{}");
  let attrValueMain = JSON.parse(localStorage.getItem("selectedAttributeValueMain") || "{}");
  let groupValue = attrValue.split(" ").length > 1 ? attrValue.split(" ")[1] : attrValue;
  let multiDiamondArr:any = localStorage.getItem("multiDiamondArr") || [];
  multiDiamondArr = JSON.parse(multiDiamondArr || "[]");
  let selectedMultiAttr = "";
  function addClicked(){
    if(!selectedMultiAttr)
    {
      return;
    }
    if(selectedMultiAttr && !multiDiamondArr.includes(selectedMultiAttr))
    {
      multiDiamondArr.push(selectedMultiAttr);
      localStorage.setItem("multiDiamondArr",JSON.stringify(multiDiamondArr));
    }
    localStorage.setItem("justClosed","1");
    closeModal();
    return openModal("ENTER_CT");
  }
  function cancelClicked(){
      
    closeModal();
    
  }
  function changedValue(event:any){
    selectedMultiAttr = event.target.value;
    localStorage.setItem("selectedAttributeValue",JSON.stringify(event.target.value));
  }
    return (
      <div className="p-4 pb-6 bg-gray-100 bg-white m-auto max-w-sm w-full rounded-md md:rounded-xl sm:w-[24rem]">
      <div className="w-full h-full text-center">
        <div className="flex h-full flex-col justify-between">
      <span>Add For {groupValue} Below: </span>
      <select onChange={changedValue} name="attribute-value" style={{ height:"30px", marginTop:"20px", outline:"solid 1px"}}>
        <option value=""> Select more {groupValue} type</option>
        {
          data?.attributes?.filter((x:any) => ["Diamond"].includes(x.name))[0].values?.filter((x:any)=>x.vendor_type === 1 && x.value.includes(groupValue) && x.value != attrValue && x.value != attrValueMain && !multiDiamondArr.includes(x.value) ).map((y:any)=>{
            return <option value={y.value}>{y.value}</option>
          })
        }
      </select>
      <div className="row">
      <Button onClick={addClicked} style={{width:"70px", marginTop:"20px", marginRight:"10px"}}>Add</Button>
      <Button onClick={cancelClicked} style={{width:"70px", marginTop:"20px", marginRight:"10px", background:"RED"}}>Cancel</Button>
      </div>
      </div>
      </div>
      </div>
    );
  };
  
  export default AddMoreTypeView;
  