// import { authStore } from '../../stores/auth' // Unused for now
import { ProjetProvider } from "../../contexts/ProjetContext";
import HeadZone from "./HeadZone";
import ListZone from "./ListZone";

export default () => {
  return (
    <ProjetProvider>
      <div className="space-y-8">
        
        <HeadZone />

        <ListZone />

      </div>
    </ProjetProvider>
  );
};

