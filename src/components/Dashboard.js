import React, { Fragment, useState } from "react";
import { useUsers } from "../Services/Users";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuidv4 } from "uuid";
import { useAddUser } from "../Services/NewUser";
import { useEditUSer } from "../Services/EditUser";
import { useDeleteUser } from "../Services/DeleteUser";
import { useDebounce } from "./hooks/Search";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [editID, setEditID] = useState("");
  const { data: UsersDetails, isLoading, isError } = useUsers();

  const { mutate: addUser } = useAddUser();
  const { mutate: editUser } = useEditUSer();
  const { mutate: deleteUser } = useDeleteUser();
  const [searchItem, setSearchItem] = useState("");
  const debounceItem = useDebounce(searchItem, 400);
  let filteredData = UsersDetails?.filter((data) => {
    const text =
      `${data?.name}${data?.email} ${data?.phone} ${data?.address.city} ${data?.address.state} ${data?.address.zip} ${data?.tags}`.toLocaleLowerCase();
    return text.includes(debounceItem);
  });

  const resetForm = () => {
    formik.setFieldValue("name", "");
    formik.setFieldValue("email", "");
    formik.setFieldValue("phone", "");
    formik.setFieldValue("state", "");
    formik.setFieldValue("city", "");
    formik.setFieldValue("zip", "");
    formik.setFieldValue("lead","")
  };
  const handleEdit = (row) => {
    setOpen(true);
    setEditID(row.id);
    formik.setFieldValue("name", row.name);
    formik.setFieldValue("email", row.email);
    formik.setFieldValue("phone", row.phone);
    formik.setFieldValue("state", row.address.state);
    formik.setFieldValue("city", row.address.city);
    formik.setFieldValue("zip", row.address.zip);
    formik.setFieldValue("lead", row.tags);
  };
  const formValues = {
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    zip: "",
    lead: "",
  };

  const formValidation = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required"),
    phone: yup.string(),
  });

  const handleSubmit = (values) => {
    const { name, email, phone, state, city, zip, lead } = values;
    let tags = lead.split(',');
    const userWithId = {
      id: !editID ? uuidv4() : editID,
      name: name,
      email: email,
      phone: phone,
      tags: tags,
      address: {
        city: city,
        state: state,
        zip: zip,
      },
    };
    !editID ? addUser(userWithId) : editUser(userWithId);
    handleClose();
    resetForm();
    setEditID("");
  };

  const formik = useFormik({
    initialValues: formValues,
    validationSchema: formValidation,
    onSubmit: handleSubmit,
  });

  const handleOpen = () => {
    setOpen(true);
    resetForm();
  };

  const handleClose = () => {
    setEditID("");
    setOpen(false);
  };
 

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error...</p>;
  return (
    <Fragment>
      <div className="p-[20px]">
        <div className="flex justify-between">
          <div>
            <input
              className="border-2 p-[8px] focus:outline-none focus:border-2 focus:border-red-200 border-slate-100 rounded-md "
              placeholder="Search here...."
              type="text"
              value={searchItem}
              onChange={(e) => {
                setSearchItem(e.target.value.toLocaleLowerCase());
              }}
            />
          </div>
          <div className="flex justify-end">
            <Button size="small" variant="contained" onClick={handleOpen}>
              Add
            </Button>
          </div>
        </div>
    

        <div className="block overflow-auto bg-blue-100 rounded-md mt-[20px] p-[10px] w-full ">
          <table className=" w-full text-center ">
            <thead className="w-full border-b-2 border-[#d5dde8]">
              <tr className="w-full">
                <th></th>
                <th>Tags</th>
                <th>Name</th>
                <th>Email</th>
                <th>phone</th>
                <th>state</th>
                <th>city</th>
                <th>zip</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((data) => {
                return (
                  <tr key={data?.id} className="">
                    <td className="p-[5px] md:p-[0px] ">
                      {
                        <>
                          <IconButton>
                            <EditIcon
                              className="text-blue-600"
                              onClick={() => {
                                setOpen(true);
                                handleEdit(data);
                              }}
                            />
                          </IconButton>
                          <IconButton>
                            <DeleteIcon
                              className="text-red-500 font-[10px] "
                              onClick={() => {
                                const deleteId = data.id;
                                let text = "Are you sure?";
                                if (window.confirm(text) === true) {
                                  deleteUser(deleteId);
                                }
                              }}
                            />
                          </IconButton>
                        </>
                      }
                    </td>
                    <td className="p-[5px] md:p-[0px] ">
                      {data?.tags?.map((item) => {
                        return (
                          <p
                            key={item}
                            className="bg-red-200 rounded-sm m-[2px] "
                          >
                            {item}
                          </p>
                        );
                      })}
                    </td>
                    <td className="p-[5px] md:p-[0px]">{data?.name}</td>
                    <td className="p-[5px] md:p-[0px] "> {data?.email} </td>
                    <td className="p-[5px] md:p-[0px] "> {data?.phone} </td>
                    <td className="p-[5px] md:p-[0px] ">
                      {data?.address.city}
                    </td>
                    <td className="p-[5px] md:p-[0px] ">
                      {data?.address.state}
                    </td>
                    <td className="p-[5px] md:p-[0px] ">{data?.address.zip}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{!editID ? "Add User" : "Edit User"}</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
              <DialogContent>
                {Object.keys(formValues)?.map((field) => (
                  <TextField
                    key={field}
                    id={field}
                    name={field}
                    label={field.toUpperCase()}
                    value={formik.values[field]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    helperText={formik.touched[field] && formik.errors[field]}
                    sx={{
                      margin: 1,
                    }}
                  />
                ))}
              </DialogContent>
              <DialogActions>
                <Button size="small" variant="contained" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" size="small" variant="contained">
                  Save
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </div>
        <div></div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
