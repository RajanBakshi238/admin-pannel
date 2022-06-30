import ClassItem from "./ClassItem";

const ClassList = ({listings, handleEdit, handleDelete}) => {
  return (
    <>
      {listings.map(({ id, data }) => (
        <ClassItem key={id} data={data} id={id} handleEdit={handleEdit} handleDelete={handleDelete}/>
      ))}
    </>
  );
};

export default ClassList;
