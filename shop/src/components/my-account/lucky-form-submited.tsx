import Input from "@components/ui/input";
import TextArea from "@components/ui/text-area";
import { useForm } from "react-hook-form";
import { useLuckyMutation } from "@framework/contact/contact.mutation";
import Button from "@components/ui/button";
import useWindowSize from "react-use/lib/useWindowSize";
import { useUI } from "@contexts/ui.context";

type Props = {
    layout?: "modal";
  };

const LuckyFormSubmited: React.FC<Props> = () => {

	const { width:deviceWidth } = useWindowSize();

    return (
        <div className="bg-white p-5" style={{width:deviceWidth - ((deviceWidth*(deviceWidth > 1000 ? 75 : 20))/100)}}>
          <h1 className="p-5" style={{fontSize:"16px"}}>
            
            Thank you for your Inputs.
            <br/>
            <br/>
            We will get back to you if required.
            <br/>
            <br/>
            Enjoy all the benefits of ZWELER B2B portal.
            <br/>
            <br/>
            We are still exploring lot of features to make your experience more appealing
            <br/>
            <br/>
            Please keep coming back frequently and you can always leave us your feedback on this email address 
            <br/><br/>
            <strong>Happy Purchasing!!!</strong><br />
            <br/>          
            <a style={{color:"blue"}} href="mailto:info@zweler.com">info@zweler.com</a>
          </h1>
        </div> 
    )
}

export default LuckyFormSubmited;
