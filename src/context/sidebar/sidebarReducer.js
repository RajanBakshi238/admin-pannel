export default (state, action) => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        open: !state.open,
      };

    default:
      return state;
  }
};
