import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase.config";

import MainArea from "../../layout/MainArea";
import Loading from "../../Loading";
import swal from "sweetalert";
import ClassList from "./ClassList";
import { toast } from "react-toastify";

const Classes = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        // Get reference
        const listingRef = collection(db, "classes");

        // Creating query
        const q = query(listingRef, orderBy("classCode", "asc"));

        //Executing query
        const querySnap = await getDocs(q);

        const listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleEdit = async ({ id, data }) => {
    const studentRef = collection(db, "students");
    const studentQuery = query(
      studentRef,
      where("classCode", "==", data.classCode)
    );
    const studentSnapshot = await getDocs(studentQuery);
    const length = studentSnapshot.size;

    if (length > 0) {
      swal(
        "Error",
        `There are ${length} students registerd with this class first delete or shift these student and try again`,
        "error"
      );
      return;
    }

    navigate("/register-class", { state: { id, ...data } });
  };

  const handleDelete = async ({ id, data }) => {
    const studentRef = collection(db, "students");
    const studentQuery = query(
      studentRef,
      where("classCode", "==", data.classCode)
    );
    const studentSnapshot = await getDocs(studentQuery);
    const length = studentSnapshot.size;

    if (length > 0) {
      swal(
        "Error",
        `There are ${length} students registerd with this class first delete or shift these student and try again`,
        "error"
      );
      return;
    }
    try{
      await deleteDoc(doc(db, "classes", id ))
      toast.success('Class Deleted Sucessfully');
    }catch(e){
      toast.error('Something Went Wrong please try again !')
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <MainArea>
      <div className="grid grid-cols-3 gap-6">
        <ClassList listings={listings} handleEdit={handleEdit} handleDelete={handleDelete} />
      </div>
    </MainArea>
  );
};

export default Classes;
