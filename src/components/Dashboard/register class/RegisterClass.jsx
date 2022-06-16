import MainArea from '../../layout/MainArea'
import ClassRegistrationForm from '../../Form/ClassRegistrationForm'
// import StudentRegisterationForm from '../Form/StudentRegisterationForm''

const RegisterClass = () => {
    return (
        <MainArea open={true}>
            <div className="flex flex-col border border-[#00000020] w-full rounded-xl">
                <div className="p-5 flex items-center">
                    <h3 className="font-semibold uppercase text-[#2196f3]">class registration form</h3>
                </div>
                <div className='p-5'>
                    <ClassRegistrationForm />
                    
                </div>
            </div>
        </MainArea>
    )
}

export default RegisterClass