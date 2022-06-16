const MainCard = ({children}) => {
  return (
    <div className="flex flex-col border border-[#00000020] w-full rounded-xl">
        {children}
    </div>
  )
}

export default MainCard