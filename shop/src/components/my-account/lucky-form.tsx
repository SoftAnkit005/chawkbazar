import Input from "@components/ui/input";
import TextArea from "@components/ui/text-area";
import { useForm } from "react-hook-form";
import { useLuckyMutation } from "@framework/contact/contact.mutation";
import Button from "@components/ui/button";
import useWindowSize from "react-use/lib/useWindowSize";
import { useUI } from "@contexts/ui.context";
import Footer from "@components/layout/footer/footer";

type Props = {
    layout?: "modal";
  };

  interface LuckyInputType {
    company:string;
    name: string;
    phone: number;
    email: string;
    address: string;
  }

const LuckyForm: React.FC<Props> = () => {
    const {
        register,
        handleSubmit,
      } = useForm<LuckyInputType>({
      });
  const { mutate: lucky, isLoading: loading } = useLuckyMutation();
  const { closeModal, setModalView, openModal } = useUI();
  async function openLuckyFormSubmited() {
    closeModal();
    setModalView("LUCKY_FORM_SUBMITED_VIEW");
    return openModal();
  }

    function onSubmit({ company, name, phone, email, address }: LuckyInputType) {
      lucky(
        {
          company, name, phone, email, address
        },
        {
          onSuccess: (data:any) => {
            openLuckyFormSubmited();
          },
          onError: (error: any) => {
            openLuckyFormSubmited();
          },
        }
      );
    }

	const { width:deviceWidth } = useWindowSize();

    return (
      <>
      <div className="bg-white p-5" style={{width: deviceWidth > 1800 ? '88rem' : `${deviceWidth - (deviceWidth * 0.1)}px`, padding: '1rem'}}>
          <span style={{ fontSize: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="https://zweler.com/_next/image?url=https%3A%2F%2Fzweler.com%2Fbackend%2Fstorage%2F2830%2FLogo.png&w=256&q=75" alt="Logo" style={{ width: "260px", height: "60px" }} />
          </span>
          
          <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center"
      noValidate
      > 

      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      />

        <br/>

        <div className="container">
          <div className="row">
            <div className="col-md-4 col-sm-12 mb-4">
              <div className="text-center">
                <h2>Zweler Intro</h2>
                <p style={{ marginBottom: '12px' }}>Welcome on board. Connect with reputed retailers across the world.</p>
              </div>
              <iframe className="w-100" style={{ height: '65vh' }} src="https://www.youtube.com/embed/UVPVna7xgoA" title="Zweler Intro" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
              <div className="d-flex flex-column flex-sm-row align-items-center">
                <a href="https://play.google.com/store/apps/details?id=com.aviral.zweler"><img src="../../assets/images/play-store.png" alt="Play Store" className="img-fluid" style={{ padding: '8px', marginLeft: '8px', width: '90%' }} /></a>
                <a href="https://apps.apple.com/in/app/zweler/id6461119914"><img src="../../assets/images/app-store.png" alt="App Store" className="img-fluid" style={{ padding: '8px', marginLeft: '8px', width: '90%' }} /></a>
              </div>
            </div>

            <div className="col-md-4 col-sm-12 mb-4">
              <div className="text-center">
                <h2>Manufacturers</h2>
                <p style={{ marginBottom: '12px' }}>Welcome to Zweler.com. Get standard wholesale business rates of business directly </p>
              </div>
              <iframe className="w-100" style={{ height: '65vh' }} src="https://www.youtube.com/embed/oIh0OzUKvqA" title="Video 2"></iframe>
              <div className="d-flex flex-column flex-sm-row align-items-center">
                <a href="https://play.google.com/store/apps/details?id=com.aviral.zwelervendor"><img src="../../assets/images/play-store.png" alt="Play Store" className="img-fluid" style={{ padding: '8px', marginLeft: '8px', width: '90%' }} /></a>
                <a href="https://apps.apple.com/in/app/zweler-vendor/id6455375801"><img src="../../assets/images/app-store.png" alt="App Store" className="img-fluid" style={{ padding: '8px', marginLeft: '8px', width: '90%' }} /></a>
              </div>
            </div>

            <div className="col-md-4 col-sm-12 mb-4">
              <div className="text-center">
                <h2>Retailers</h2>
                <p style={{ marginBottom: '12px' }}>Welcome to ZWELER. Dear user make the most of this B2B amalgum. Happy shopping.</p>
              </div>
              <iframe className="w-100" style={{ height: '65vh' }} src="https://www.youtube.com/embed/F0_LCCT81F0" title="Zweler Retailers" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
              <div className="d-flex flex-column flex-sm-row align-items-center">
                <a href="https://play.google.com/store/apps/details?id=com.aviral.zweler"><img src="../../assets/images/play-store.png" alt="Play Store" className="img-fluid" style={{ padding: '8px', marginLeft: '8px', width: '90%' }} /></a>
                <a href="https://apps.apple.com/in/app/zweler/id6461119914"><img src="../../assets/images/app-store.png" alt="App Store" className="img-fluid" style={{ padding: '8px', marginLeft: '8px', width: '90%' }} /></a>
              </div>
            </div>
          </div>
        </div>

        <p className="container">With a legacy of over 80 years, Zweler is now a GOI certified Start Up branded as the 'World's First Platform connecting the Manufacturers & Retailers with 100% Customised solutions.' The platform is perhaps a revolution by itself and shall define the future of Diamond Jewellery industry across the globe. Showcasing the finest designs from the best manufacturers, Zweler promises to bring forth a scintillating collection with an unparalleled jewellery buying experience at your fingertips!</p>

        <div className="flex flex-col space-y-3.5">
        <span style={{ fontSize: "30px", fontWeight: '600', display: "flex", alignItems: "center", justifyContent: "center", marginTop: '12px' }}>Reach out To US</span>
        <span className="container" style={{ fontSize: "15px", fontWeight: '400', display: "flex", alignItems: "center", justifyContent: "center", marginBottom: '12px', marginTop: '0px' }}>Your Suggestions and Feedback are most valuable to us.</span>

{/*         
        <div className="flex flex-wrap justify-center space-x-2" style={{ border: '1px solid rgb(204, 204, 204)', boxShadow: '4px 5px 10px rgb(1, 1, 1)', borderRadius: '20px' }}>
          <div className="relative w-96 mx-2 my-4 p-4 aspect-w-16 aspect-h-9" style={{ height: '30vh', border: '1px solid #ccc', boxShadow: '4px 5px 10px rgba(1, 1, 1, 20)', borderRadius: '8px', marginLeft: '3%', marginRight: '3%' }}>
            <iframe className="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" title="Video 1"></iframe>
          </div>

          <div className="relative w-96 mx-2 my-4 p-4 aspect-w-16 aspect-h-9" style={{ height: '30vh', border: '1px solid #ccc', boxShadow: '4px 5px 10px rgba(1, 1, 1, 20)', borderRadius: '8px', marginLeft: '3%', marginRight: '3%' }}>
            <iframe className="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" title="Video 2"></iframe>
          </div>

          <div className="relative w-96 mx-2 my-4 p-4 aspect-w-16 aspect-h-9" style={{ height: '30vh', border: '1px solid #ccc', boxShadow: '4px 5px 10px rgba(1, 1, 1, 20)', borderRadius: '8px', marginLeft: '3%', marginRight: '3%' }}>
            <iframe className="absolute inset-0 w-full h-full" src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" title="Video 3"></iframe>
          </div>
        </div> */}



        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-3">
              <Input  
                labelKey="Company Name"
                variant="solid"
                style={{ width: '100%' }}
                {...register("company")}            
              />
            </div>
            <div className="col-md-6 mb-3">
              <Input  
                labelKey="Your Full Name"
                variant="solid"
                style={{ width: '100%' }}
                {...register("name")}
              />
            </div>
            <div className="col-md-6 mb-3">
              <Input  
                labelKey="Mobile Number"
                variant="solid"
                style={{ width: '100%' }}
                type="text"
                {...register("phone")}
              />
            </div>
            <div className="col-md-6 mb-3">
              <Input  
                labelKey="Email Address"
                variant="solid"
                style={{ width: '100%' }}
                type="email"
                {...register("email")}
              />
            </div>
            <div className="col-12 mb-3">
              <TextArea 
                labelKey="Address"
                variant="solid"
                style={{ width: '100%' }}
                {...register("address")}
              />
            </div>
          </div>
        </div>


          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="h-12 w-[20%] mt-1.5 mx-auto flex items-center justify-center"
            style={{ background: '#5d6b6b' }}
          >
            {"Submit"}
          </Button>
          
          {/* New close button */}
          <Button
            type="button"  // Set type as "button" to prevent form submission
            onClick={() => closeModal()}  // Assuming closeModal is a function to close the modal
            className="h-12 w-[20%] mt-1.5 mx-auto flex items-center justify-center"
          style={{ background: '#d87876', marginTop: '1rem' }}
          >
            {"Close"}
          </Button>
      </div>      
      </form>    
        </div> 
        <Footer />
        </>
    )
}

export default LuckyForm;
