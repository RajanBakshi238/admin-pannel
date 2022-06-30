const StudentDetail = ({ property, value }) => {
  return (
    <li className="mb-3 w-2/3 flex justify-between items-center">
      <span className="text-slate-600  text-lg font-bold">{property}</span>
      <span className="text-[#646464] font-semibold text-sm basis-1/2">
        {value}
      </span>
    </li>
  );
};

export default StudentDetail;
