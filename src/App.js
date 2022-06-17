import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setUser } from "./redux/actions";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import RegisterStudent from "./components/Dashboard/register student/RegisterStudent";
import RegisterClass from "./components/Dashboard/register class/RegisterClass";
import Classes from "./components/Dashboard/classes/Classes";
import Students from "./components/Dashboard/students/Students";
import PrivateRoute from "./components/PrivateRoute";
import RegisterUser from "./components/Dashboard/register user/RegisterUser";
import PayFee from "./components/Dashboard/pay fee/PayFee";
import ViewStudent from "./components/Dashboard/view student/ViewStudent";
import Transactions from "./components/Dashboard/transactions";


function App() {
  const dispatch = useDispatch();

  const auth = getAuth();

  useEffect(() => {
    console.log("test");
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(setUser(null));
      }
    });
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignUp />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />}>
              <Route path="register-user" element={<RegisterUser />} />
              <Route path="register-student" element={<RegisterStudent />} />
              <Route path="register-class" element={<RegisterClass />} />
              <Route path="classes" element={<Classes />} />
              <Route path="students" element={<Students />} />
              <Route path="pay-fee" element={<PayFee />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="view-student/:id/:uid" element={<ViewStudent />} />
            </Route>
          </Route>
        </Routes>
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;
