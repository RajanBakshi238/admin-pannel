import { ReactComponent as Logo } from '../assets/logo.svg'
import { useLocation } from 'react-router-dom'

import BgSvg from '../assets/BgSvg'
import SignUpForm from '../components/Form/SignUpForm'
import SignInForm from '../components/Form/SignInForm'

const SignUp = () => {
    const location = useLocation()
    

    return (
        <div className="grid grid-cols-2">
            
            <div className="flex items-center justify-end h-full p-16 ">
                <div className="w-1/2 h-full">
                    <div className="w-12 h-12">
                        <Logo className='w-full h-full'/>
                    </div>
                    
                    {location.pathname === '/sign-up' ? <SignUpForm /> : <SignInForm />}
                    
                </div>
            </div>

            <div className="relative px-28 overflow-hidden bg-gray-800 flex items-center h-screen " > 
                <BgSvg />
                <div className='z-10 relative w-full max-w-2xl'>
                    <div className="text-5xl font-bold leading-none text-gray-100">
                        <div>Welcome to</div>
                        <div>our Accounts Admin Panel</div>
                    </div>
                    <div className="mt-6 tracking-tight leading-6 text-gray-400 text-base">
                         Fuse helps developers to build organized and well coded dashboards full of beautiful and rich modules. Join us and start building your admin panel today. 
                    </div>
                </div>    
            </div>
        </div>
    )
}

export default SignUp