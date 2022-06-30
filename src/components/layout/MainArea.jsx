import { useContext } from "react";
import SidebarContext from "../../context/sidebar/sidebarContext";
import { Main, DrawerHeader } from "../utils";

const MainArea = ({ children }) => {
  const { open } = useContext(SidebarContext);

  return (
    <Main open={open}>
      <DrawerHeader />
      {children}
    </Main>
  );
};

export default MainArea;
