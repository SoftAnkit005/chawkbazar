import Container from "@components/ui/container";
import WidgetLink from "@components/widgets/widget-link";
import WidgetSocial from "@components/widgets/widget-social";
import WidgetContact from "@components/widgets/widget-contact";
import WidgetImg from "@components/widgets/widget-img";
import WidgetRight from "@components/widgets/widget-right";

interface WidgetsProps {
  widgets: {
    id: number;
    widgetTitle: string;
    lists: any;
  }[];
}

const Widgets: React.FC<WidgetsProps> = ({ widgets }) => {
  return (
    <Container>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 md:gap-9 lg:gap-x-8 xl:gap-5 my-[40px]">
        <WidgetImg />
        
        {widgets.map((widget, index) => (
          <WidgetLink data={widget} key={`widget-link-${index}`} />
        ))}      
          <WidgetSocial />
        
        <WidgetContact />

        <WidgetRight />
        
      </div>
    </Container>
  );
};

export default Widgets;
