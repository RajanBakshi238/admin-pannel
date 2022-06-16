import MainArea from '../../layout/MainArea'
import StudentRegisterationForm from '../../Form/StudentRegisterationForm'

const RegisterStudent = () => {
  return (
    <MainArea open={true}>
                <div className="flex flex-col border border-[#00000020] w-full rounded-xl">
                    <div className="p-5 flex items-center">
                        <h3 className="font-semibold uppercase text-[#2196f3]">student registration form</h3>
                    </div>
                    <div className='p-5'>

                        <StudentRegisterationForm />

                    </div>

            </div>
    </MainArea>



)
}

export default RegisterStudent