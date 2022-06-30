import UserRegistrationForm from "./UserRegistrationForm";
import MainArea from "../../layout/MainArea";
import MainCard from "../MainCard";

const RegisterUser = () => {
  return (
    <MainArea>
      <MainCard>
        <div className="p-5 flex items-center">
          <h3 className="font-semibold uppercase text-[#2196f3]">
            Register User
          </h3>
        </div>
        <div className="p-5">
          <UserRegistrationForm />
        </div>
      </MainCard>
    </MainArea>
  );
};

export default RegisterUser;
