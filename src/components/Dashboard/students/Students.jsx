import { useState, useEffect, useMemo } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase.config";
import { FaUserTie } from "react-icons/fa";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

import FilterComponent from "../FilterComponent";
import MainArea from "../../layout/MainArea";
import MainCard from "../MainCard";
import Loading from "../../Loading";

createTheme(
  "solarized",
  {
    text: {
      primary: "#2196f3",
    },
    background: {
      default: "transparent",
    },
    divider: {
      default: "white",
    },
    action: {
      button: "rgba(0,0,0,.54)",
      hover: "rgba(0,0,0,.08)",
      disabled: "rgba(0,0,0,.12)",
    },
    striped: {
      default: "#d4d4d4",
      text: "#0f172a",
    },
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "18px",
      },
    },
  },
  "dark"
);

const customStyles = {
  headCells: {
    style: {
      fontWeight: "bold",
      fontSize: "15px",
    },
  },
  header: {
    style: {
      fontWeight: 700,
      fontSize: "18px",
    },
  },
};

const editBtnStyle = {
  padding: "3px",
  borderRadius: "50px",
  background: "#dedede",
  fontSize: "22px",
  fontWeight: "600",
};

const Students = () => {
  const [data, setData] = useState([]);
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ filterText: "", filterSession: "" });

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const studentsRef = collection(db, "students");
        const usersRef = collection(db, "users");
        const q = query(studentsRef, orderBy("rollNumber", "asc"));

        const querySnap = await getDocs(q);
        const querySnap2 = await getDocs(usersRef);

        const students = [];
        querySnap.forEach((doc) => {
          return students.push({ id: doc.id, ...doc.data() });
        });
        setStudents(students);

        const users = [];
        querySnap2.forEach((doc) => {
          console.log(doc.id)
          return users.push({ uid: doc.id, ...doc.data() });
        });
        setUsers(users);

        const mergedData = [];
        students.map((ele) => {
          const user = users.find((item) => ele.userId === item.uid);

          // delete user.id;
          mergedData.push({
            ...ele,
            ...user,
          });
        });

        setData(mergedData);

        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchListings();
  }, []);

  const navigate = useNavigate();

  const handleUserEdit = (row) => {
    navigate(`/view-student/${row.id}/${row.userId}`);
  };

  const filteredItems = data.filter(
    (item) =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(filter.filterText.toLowerCase()) !== -1
           &&
        item.session.includes(filter.filterSession)
  );

  const columns = [
    {
      name: "User Name",
      selector: "userName",
      sortable: true
    },
    {
      name: "Roll Number",
      selector: "rollNumber",
      sortable: true
    },
    {
      name: "Full Name",
      cell: (d) => <>{d.firstName + " " + d.lastName}</>
    },
    {
      name: "Class",
      selector: "standard"
    },
    {
      name: "Session",
      selector: "session",
    },
    {
      name: "Fee Status",
      // selector: (row) => (
      //   <div className={`common ${row.pendingFee <= 0 ? "paid" : "pending"}  `}>
      //     {row.pendingFee <= 0 ? "Paid" : "Pending"}
      //   </div>
      // ),
      selector: "pendingFee",
      cell: (d) => (
        <div className={`common ${d.pendingFee <= 0 ? "paid" : "pending"}  `}>
          {d.pendingFee <= 0 ? "Paid" : "Pending"}
        </div>
      ),
      sortable: true
    },
    {
      name: "Action",
      // selector: (row) => (
      //   <button onClick={() => handleUserEdit(row)}>
      //     <FaUserEdit style={editBtnStyle} />
      //   </button>
      // ),
      selector: "id",
      cell: (d) => (
        <button onClick={() => handleUserEdit(d)}>
          <FaUserTie style={d} />
        </button>
      ),
    },
  ];

  const handleFilter = (e) => {
    setFilter((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const subHeaderComponent = useMemo(() => {
    return <FilterComponent filter={filter} onFilter={handleFilter} />;
  }, [filter]);

  const tableData = {
    columns,
    data: filteredItems,
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <MainArea>
      <MainCard>
        <DataTableExtensions {...tableData} filter={false}>
          <DataTable
            title="STUDENT DETAILS"
            columns={columns}
            subHeader
            subHeaderComponent={subHeaderComponent}
            data={filteredItems}
            theme="solarized"
            striped
            highlightOnHover
            customStyles={customStyles}
          />
        </DataTableExtensions>
      </MainCard>
    </MainArea>
  );
};

export default Students;
