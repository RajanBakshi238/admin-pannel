import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../../firebase.config";
import { FaEllipsisV, FaEdit } from "react-icons/fa";

import MainArea from "../../layout/MainArea";
import Loading from "../../Loading";

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
        const q = query(listingRef, orderBy("timestamp", "desc"));

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

  const handleEdit = ({id, data}) => {
    navigate('/register-class', {state: {id, ...data}})
  }
  

  if (loading) {
    return <Loading />;
  }

  return (
    <MainArea open={true}>
      <div className="grid grid-cols-3 gap-6">
        {listings.map(({ id, data }) => (
          <div className="course-card" key={id}>
            <div>
              <h2 className="card-heading">{data.standard}</h2>
              <span onClick={() => handleEdit({id, data})}>
                <FaEdit />
              </span>
            </div>
            <div>
              <h3>Class Code</h3>
              <h5>{data.classCode}</h5>
            </div>
            <div>
              <h3>Admission Fee</h3>
              <h5>{`Rs ${data.admissionFee}`}</h5>
            </div>
            <div>
              <h3>Monthly Fee</h3>
              <h5>{`Rs ${data.monthlyFee}`}</h5>
            </div>
          </div>
        ))}
      </div>
    </MainArea>
  );
};

export default Classes;
