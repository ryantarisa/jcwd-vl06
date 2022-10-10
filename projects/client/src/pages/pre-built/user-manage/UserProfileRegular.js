import React, { useEffect, useState } from "react";
import Head from "../../../layout/head/Head";
import DatePicker from "react-datepicker";
import { Modal, ModalBody, FormGroup } from "reactstrap";
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
import { getDateStructured } from "../../../utils/Utils";
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

  useEffect(() => {
    setProfileName(formData.name);
  }, [formData, setProfileName]);

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setAddressData();
  };

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
      // console.log(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  // ADD NEW ADDRESS
  const addNewAddress = async () => {
    try {
      const response = await axios.post(`${API_URL}/address/add-address`, {
        name: addressData.name,
        address: addressData.address,
        user_id: user.id,
      });

      setAddress(response.data.response);
      // console.log(response.data.response);
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
          <div className="data-item" onClick={() => setModal(true)}>
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
                  onClick={() => submitForm()}
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
                              {/* <input
                                value={item.name}
                                type="text"
                                id="address-l1"
                                name="address"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.address}
                                className="form-control"
                              /> */}
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
                              {/* <input
                                value={item.address}
                                type="text"
                                id="address-l2"
                                name="address2"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.address2}
                                className="form-control"
                              /> */}
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
                                    onClick={() => submitForm()}
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
    </React.Fragment>
  );
};
export default UserProfileRegularPage;
