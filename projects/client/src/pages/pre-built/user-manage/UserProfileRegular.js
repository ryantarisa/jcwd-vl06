import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import DatePicker from "react-datepicker";
import { Modal, ModalBody, FormGroup, Input, Form } from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  Button,
  RSelect,
} from "../../../components/Component";
import { countryOptions, userData } from "./UserData";
import axios from "axios";
import { API_URL } from "../../../constants/API";

const UserProfileRegularPage = ({ sm, updateSm, setProfileName }) => {
  const user = JSON.parse(window.localStorage.getItem("profile"));
  const userAddress = JSON.parse(window.localStorage.getItem("address"));

  const [address, setAddress] = useState([]);
  const [addressData, setAddressData] = useState();
  const [modalTab, setModalTab] = useState("1");
  const [userInfo, setUserInfo] = useState(userData[0]);
  const [formData, setFormData] = useState({
    name: "Ariel",
    displayName: "Ishtiak",
    phone: "818474958",
    dob: "1980-08-10",
    address: "2337 Kildeer Drive",
    address2: "",
    state: "Kentucky",
    country: "Canada",
  });
  const [modal, setModal] = useState(false);
  const [modalMain, setModalMain] = useState(false);
  const [view, setView] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [modalAdd, setModalAdd] = useState(false);

  useEffect(() => {
    setProfileName(formData.name);
  }, [formData, setProfileName]);

  const submitForm = () => {
    let submitData = {
      ...formData,
    };
    setUserInfo(submitData);
    setModal(false);
  };

  //GET ALL ADDRESS
  const getAllAddress = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/address/get-address/${user.id}`
      );

      setAddress(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE ADDRESS
  const delAdress = async (id) => {
    try {
      await axios.delete(`${API_URL}/address/delete-address/${id}`);
    } catch (error) {
      console.log(error);
    }
    getAllAddress();
  };

  // OnChange function to get the input data
  const onInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // console.log(address);
  // ADD NEW ADDRESS
  const addNewAddress = async () => {
    try {
      if (!address.address_name)
        return setErrMsg("Please insert your address name");
      if (!address.full_address)
        return setErrMsg("Please insert your full address");

      await axios.post(`${API_URL}/address/add-address`, {
        name: address.address_name,
        address: address.full_address,
        user_id: user.id,
      });
      setModalAdd(false);
      setModal(true);
      getAllAddress();
    } catch (error) {
      console.log(error);
    }
  };

  // SET MAIN ADDRESS
  const setMainAddress = async (data) => {
    try {
      const address = await axios.patch(`${API_URL}/address/set-main-address`, {
        id: data,
        user_id: user.id,
      });

      console.log(address.data);
      getAllAddress();
      setModalMain(true);
      localStorage.setItem("address", JSON.stringify(address.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllAddress();
  }, []);

  return (
    <React.Fragment>
      <Head title="User List - Profile"></Head>
      <BlockHead size="lg">
        <BlockBetween>
          <BlockHeadContent>
            <BlockTitle tag="h4">Personal Information</BlockTitle>
            <BlockDes>
              <p>
                Basic info, like your name and address, that you use on Ramu
                Website.
              </p>
            </BlockDes>
          </BlockHeadContent>
          <BlockHeadContent className="align-self-start d-lg-none">
            <Button
              className={`toggle btn btn-icon btn-trigger mt-n1 ${
                sm ? "active" : ""
              }`}
              onClick={() => updateSm(!sm)}
            >
              <Icon name="menu-alt-r"></Icon>
            </Button>
          </BlockHeadContent>
        </BlockBetween>
      </BlockHead>

      <Block>
        <div className="nk-data data-list">
          <div className="data-head">
            <h6 className="overline-title">Profile Data</h6>
          </div>
          <div className="data-item" style={{ cursor: "default" }}>
            <div className="data-col">
              <span className="data-label">First Name</span>
              <span className="data-value">{user.first_name}</span>
            </div>
            <div className="data-col data-col-end">
              {/* <span className="data-more">
                <Icon name="forward-ios"></Icon>
              </span> */}
            </div>
          </div>
          <div className="data-item" style={{ cursor: "default" }}>
            <div className="data-col">
              <span className="data-label">Last Name</span>
              <span className="data-value">{user.last_name}</span>
            </div>
            <div className="data-col data-col-end">
              {/* <span className="data-more">
                <Icon name="forward-ios"></Icon>
              </span> */}
            </div>
          </div>
          <div className="data-item" style={{ cursor: "default" }}>
            <div className="data-col">
              <span className="data-label">Email</span>
              <span className="data-value">{user.email}</span>
            </div>
            <div className="data-col data-col-end">
              {/* <span className="data-more disable">
                <Icon name="lock-alt"></Icon>
              </span> */}
            </div>
          </div>
          <div className="data-item" style={{ cursor: "default" }}>
            <div className="data-col">
              <span className="data-label">Phone Number</span>
              <span className="data-value text-soft">{user.phone}</span>
            </div>
            <div className="data-col data-col-end">
              {/* <span className="data-more">
                <Icon name="forward-ios"></Icon>
              </span> */}
            </div>
          </div>
          {/* <div className="data-item" onClick={() => setModal(true)}>
            <div className="data-col">
              <span className="data-label">Date of Birth</span>
              <span className="data-value">{userInfo.dob}</span>
            </div>
            <div className="data-col data-col-end">
              <span className="data-more">
                <Icon name="forward-ios"></Icon>
              </span>
            </div>
          </div> */}
          <div
            className="data-item"
            onClick={() => {
              setModal(true);
              getAllAddress();
            }}
          >
            <div className="data-col">
              <span className="data-label">Address</span>
              {userAddress[0].name === "" ? (
                <span className="data-value">
                  <b>Add Address Name</b>
                  <br />
                  Add Address
                </span>
              ) : (
                <span className="data-value">
                  <b>{userAddress[0].name}</b>
                  <br />
                  {userAddress[0].address}
                </span>
              )}
            </div>
            <div className="data-col data-col-end">
              <span className="data-more">
                <Icon name="forward-ios"></Icon>
              </span>
            </div>
          </div>
        </div>
      </Block>

      <Modal
        isOpen={modal}
        className="modal-dialog-centered"
        size="lg"
        toggle={() => setModal(false)}
      >
        <ModalBody>
          <a
            href="#dropdownitem"
            onClick={(ev) => {
              ev.preventDefault();
              setModal(false);
            }}
            className="close"
          >
            <Icon name="cross-sm"></Icon>
          </a>
          <div className="p-2">
            <h5 className="title">Update Address</h5>
            <ul
              style={{ justifyContent: "space-between" }}
              className="nk-nav nav nav-tabs"
            >
              <li className="nav-item">
                <a
                  className={`nav-link ${modalTab === "1" && "active"}`}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setModalTab("1");
                  }}
                  href="#address"
                >
                  Address
                </a>
              </li>
              <li>
                <Button
                  style={{ marginTop: "15px" }}
                  color="primary"
                  size="sm"
                  onClick={() => {
                    submitForm();
                    setModalAdd(true);
                  }}
                >
                  Add address
                </Button>
              </li>
            </ul>

            {address.length > 0
              ? address.map((item) => {
                  return (
                    <div key={address.id} className="tab-content">
                      <div
                        className={`tab-pane ${
                          modalTab === "1" ? "active" : ""
                        }`}
                        id="address"
                      >
                        <Row className="gy-1">
                          <Col md="6">
                            <FormGroup>
                              <label className="form-label">
                                Address Name:
                              </label>
                              <br></br>
                              <span>
                                {""} {item.name}
                              </span>
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <FormGroup>
                              <label className="form-label">
                                Full Address:
                              </label>
                              <br></br>
                              <span>
                                {""} {item.address}
                              </span>
                            </FormGroup>
                          </Col>
                          <Col size="12">
                            <ul
                              className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2"
                              style={{ justifyContent: "space-between" }}
                            >
                              {userAddress[0].id === item.id ? (
                                <li className={`text-primary`}>
                                  Main Address{" "}
                                  <Icon name={`check-circle`}></Icon>
                                </li>
                              ) : (
                                <li>
                                  <Button
                                    color="primary"
                                    size="sm"
                                    onClick={() => setMainAddress(item.id)}
                                  >
                                    Set as main
                                  </Button>
                                </li>
                              )}

                              <li style={{ color: "red", cursor: "pointer" }}>
                                <a
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    setModalTab("1");
                                    setView(true);
                                    delAdress(item.id);
                                    setView(true);
                                  }}
                                >
                                  Delete
                                </a>
                              </li>
                            </ul>
                          </Col>
                          <Col md="12">
                            <hr style={{ paddingTop: "10px" }}></hr>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={view}
        className="modal-dialog-centered"
        size="sm"
        toggle={() => setView(false)}
        key={address.id}
      >
        <ModalBody>
          <div className="text-danger bold" style={{ textAlign: "center" }}>
            Address Deleted
          </div>
          {/* <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "5px",
            }}
          >
            <Button
              onClick={() => {
                delAdress(5);
                setView(false);
              }}
              className=" text-white bg-primary"
              style={{
                marginRight: "6px",
              }}
            >
              Yes
            </Button>
            <Button
              onClick={() => setView(false)}
              className=" text-white btn-danger"
              style={{
                marginLeft: "6px",
              }}
            >
              No
            </Button> */}
          {/* </div> */}
        </ModalBody>
      </Modal>

      <Modal
        isOpen={modalMain}
        className="modal-dialog-centered"
        size="sm"
        toggle={() => setModalMain(false)}
        key={address.id}
      >
        <ModalBody>
          <div className="text-primary bold" style={{ textAlign: "center" }}>
            Set as main address!
          </div>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={modalAdd}
        toggle={() => setModalAdd(false)}
        className="modal-dialog-centered"
        size="sm"
      >
        <ModalBody>
          <div className="nk-modal-head">
            <div>
              <a href="#cancel" className="close">
                {" "}
                <Icon name="cross-sm" onClick={() => setModalAdd(false)}></Icon>
              </a>
              <div className="nk-modal-head">
                <h4 className="nk-modal-title title">
                  Add New Address
                  <small className="text-primary"> </small>
                </h4>
              </div>
              <div className="nk-tnx-details mt-md-2">
                <Col>
                  <div>
                    <ul>
                      <li
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                        className="py-1"
                      >
                        <span>Address Name</span>
                        <span>
                          <Form>
                            <FormGroup>
                              <Input
                                pattern="[A-Za-z]"
                                placeholder="Kost rantau"
                                style={{ width: "131px" }}
                                name="address_name"
                                onChange={(e) => {
                                  onInputChange(e);
                                }}
                                required
                                // title={errMsg.account_name}
                              ></Input>
                            </FormGroup>
                          </Form>
                        </span>
                      </li>
                      <li
                        className="py-1"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Full Address</span>
                        <span>
                          <Form encType="multipart/form-data">
                            <FormGroup>
                              <Input
                                placeholder="Jl. Meong No.88"
                                pattern="[A-Za-z]"
                                style={{ width: "131px" }}
                                name="full_address"
                                onChange={(e) => {
                                  onInputChange(e);
                                }}
                                required
                              ></Input>
                            </FormGroup>
                          </Form>
                        </span>
                      </li>
                    </ul>
                  </div>
                </Col>
                {errMsg === "" ? (
                  <div className="text-white text-center font-italic">.</div>
                ) : (
                  <div className="text-danger text-center font-italic">
                    {errMsg}
                  </div>
                )}

                <div className="text-center mt-3">
                  <Button
                    className="toggle d-none d-md-inline"
                    color="primary"
                    onClick={() => {
                      addNewAddress();
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};
export default UserProfileRegularPage;
