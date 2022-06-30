import PaidIcon from '@mui/icons-material/Paid';
import millify from "millify";

import { formatAmount } from '../dashboardUtils';

const PaymentCard = ({ color, text, total }) => {
  return (
    <div className="shadow mb-6">
      <div className="px-2 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="py-3 pl-3 mr-2">
              <PaidIcon sx={{ fontSize: 60, color: {color} }} />
            </div>
          </div>
          <div>
            <div className="p-2">
              {/* <h3 className="text-2xl text-gray-600 font-medium mb-2 text-right">$ {formatAmount(total)}</h3> */}
              <h3 className="text-2xl text-gray-600 font-medium mb-2 text-right">$ {millify(total.toString())}</h3>
              <p className='mb-2 font-semibold text-gray-400'>{text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
