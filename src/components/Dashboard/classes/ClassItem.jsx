import { useState } from "react";
import { FaEllipsisV, FaEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai"
import { IconButton, Menu, MenuItem, ListItemIcon } from "@mui/material";

const ClassItem = ({ data, id, handleEdit, handleDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { classCode, admissionFee, monthlyFee } = data;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="course-card" key={id}>
      <div>
        <h2 className="card-heading">{data.standard}</h2>
        <IconButton
          onClick={handleClick}
          id="demo-positioned-button"
          aria-controls={open ? "demo-positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <FaEllipsisV />
        </IconButton>

        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={async () => {
              await handleEdit({ id, data });
              handleClose();
            }}
          >
            <ListItemIcon>
              <FaEdit />
            </ListItemIcon>
            Edit
          </MenuItem>
          <MenuItem
            onClick={async () => {
              await handleDelete({ id, data });
              handleClose();
            }}
          >
            <ListItemIcon>
              <AiOutlineDelete />
            </ListItemIcon>
            Delete
          </MenuItem>
        </Menu>
      </div>

      <div>
        <h3>Class Code</h3>
        <h5>{classCode}</h5>
      </div>
      <div>
        <h3>Admission Fee</h3>
        <h5>{`Rs ${admissionFee}`}</h5>
      </div>
      <div>
        <h3>Monthly Fee</h3>
        <h5>{`Rs ${monthlyFee}`}</h5>
      </div>
    </div>
  );
};

export default ClassItem;

{
  /* <span onClick={() => handleEdit({ id, data })}>
          <FaEdit />
        </span> */
}
