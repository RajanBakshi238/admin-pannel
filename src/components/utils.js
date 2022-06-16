import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";

const drawerWidth = 280;

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== "open", })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    background: '#fff',
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        background: '#fff',
        transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
        
        }),
    }),
}));




export const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      marginLeft: `-${drawerWidth}px`,
      ...(open && {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0
      })
    })
);

export const numToWord = (num) => {
  switch(num) {
    case '1' : 
      return 'First Standard'
    case '2' : 
      return 'Second Standard'
    case '3' : 
      return 'Third Standard'
    case '4' : 
      return 'Fourth Standard'
    case '5' : 
      return 'Fifth Standard'
    case '6' : 
      return 'Sixth Standard'
    case '7' : 
      return 'Seventh Standard'
    case '8' : 
      return 'Eigth Standard'
    case '9' : 
      return 'Nineth Standard'
    case '10' : 
      return 'Tenth Standard'
    case '11' : 
      return 'Eleven Standard'
    case '12' : 
      return 'Twelven Standard'
  }
}
