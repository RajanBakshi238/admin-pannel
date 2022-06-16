import { Drawer } from "@mui/material";
import {ReactComponent as Logo} from '../../assets/logo.svg'
import Admin from '../../assets/admin.png'
import { SiFormstack } from "react-icons/si";
import { FaGraduationCap, FaUserGraduate, FaBookOpen, FaUserSecret, FaMoneyBillWaveAlt } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md"
import { Link } from 'react-router-dom';


const drawerWidth = 280;

const Sidebar = ({ open }) => {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          background: "#0f172a",
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <div>
        <div className="flex items-center w-full p-4 pl-6">
          <div className="flex items-center justify-center">
            <Logo className="w-8"/>
          </div>
        </div>
        <div className="flex flex-col items-center w-full p-4">
          <img src={Admin} className='rounded-full bg-[#fff]' alt="admin" />
          <div className="flex justify-center w-full mt-6 font-semibold text-white text-xl">
            Admin
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center justify-between">
        
        <div className='mb-2 mx-3 flex items-center px-6 py-3 text-sm leading-5 self-start font-medium text-white'>
          <span><FaUserSecret className='text-lg mr-3'/></span>
          <Link className="tracking-wider" to='/register-user'>Register User</Link>
        </div>

        <div className='mb-2 mx-3 flex items-center px-6 py-3 text-sm leading-5 self-start font-medium text-white'>
          <span><SiFormstack className='text-lg mr-3'/></span>
          <Link className="tracking-wider" to='/register-student'>Register Student</Link>
        </div>
        
        <div className='mb-2 mx-3 flex items-center px-6 py-3 text-sm leading-5 self-start font-medium text-white'>
          <span><FaGraduationCap className='text-lg mr-3'/></span>
          <Link className="tracking-wider" to='/register-class'>Register Class</Link>
        </div>

        <div className='mb-2 mx-3 flex items-center px-6 py-3 text-sm leading-5 self-start font-medium text-white'>
          <span><FaBookOpen className='text-lg mr-3'/></span>
          <Link className="tracking-wider" to='/classes'>Classes</Link>
        </div>

        <div className='mb-2 mx-3 flex items-center px-6 py-3 text-sm leading-5 self-start font-medium text-white'>
          <span><FaUserGraduate className='text-lg mr-3'/></span>
          <Link className="tracking-wider" to='/students'>Students</Link>
        </div>

        <div className='mb-2 mx-3 flex items-center px-6 py-3 text-sm leading-5 self-start font-medium text-white'>
          <span><MdOutlinePayments className='text-lg mr-3'/></span>
          <Link className="tracking-wider" to='/pay-fee'>Pay Fee</Link>
        </div>

        <div className='mb-2 mx-3 flex items-center px-6 py-3 text-sm leading-5 self-start font-medium text-white'>
          <span><FaMoneyBillWaveAlt className='text-lg mr-3'/></span>
          <Link className="tracking-wider" to='/transactions'>Transactions</Link>
        </div>

      </div>
    </Drawer>
  );
};

export default Sidebar;
