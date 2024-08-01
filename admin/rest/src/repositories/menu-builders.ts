import { CreateMenuBuilder, UpdateMenuBuilder } from "@ts-types/generated";
import Base from "./base";

class MenuBuilder extends Base<CreateMenuBuilder, UpdateMenuBuilder> {
  menuBuilders = (url: string) => {
    return this.http(url, "get");
  };
}

export default new MenuBuilder();
