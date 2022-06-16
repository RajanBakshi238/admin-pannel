import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "./Loading";

const PrivateRoute = () => {

    const {currentAdmin, loading} = useSelector((state) => state.admin);

    if(loading){
        return <Loading />
    }

    return currentAdmin ? <Outlet /> : <Navigate to='/sign-in' />
}

export default PrivateRoute
