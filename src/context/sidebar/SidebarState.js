import { useReducer } from "react";

import SidebarReducer from "./sidebarReducer";
import SidebarContext from "./sidebarContext";

const SidebarState = ({ children }) => {
  const initialState = {
    open: true,
  };

  const [state, dispatch] = useReducer(SidebarReducer, initialState);

  const toggleSidebar = () => {
    dispatch({
      type: "TOGGLE_SIDEBAR",
    });
  };

  return (
    <SidebarContext.Provider
      value={{
        open: state.open,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarState;
