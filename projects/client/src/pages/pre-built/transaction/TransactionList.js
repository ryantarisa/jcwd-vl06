import React, { useState, useEffect } from "react";
import Head from "../../../layout/head/Head";
import FormData from "form-data";
import Content from "../../../layout/content/Content";
import {
  Block,
  BlockHead,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  BlockDes,
  Icon,
  Row,
  Col,
  Button,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
} from "../../../components/Component";
import {
  Card,
  DropdownItem,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Badge,
  Input,
  FormGroup,
  Form,
} from "reactstrap";
import {
  productData,
  categoryOptions,
} from "../../pre-built/products/ProductData";
import SimpleBar from "simplebar-react";
import { get, useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../constants/API";
import ProductH from "../../../images/product/h.png";
import Dropzone from "react-dropzone";
import { Modal, ModalBody } from "reactstrap";
import { RSelect } from "../../../components/Component";
import { Autocomplete } from "@react-google-maps/api";

const TransactionList = () => {
  const user = JSON.parse(window.localStorage.getItem("profile"));
  const userAddress = JSON.parse(window.localStorage.getItem("address"));

  const [data, setData] = useState(productData);
  const [sm, updateSm] = useState(false);
  const [payment, setPayment] = useState({
    invoice_id: null,
    bank: "",
    account_name: "",
    amount: null,
  });
  const [image, setImage] = useState("");
  const [paymentData, setPaymentData] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    img: null,
    sku: "",
    price: 0,
    stock: 0,
    category: [],
    fav: false,
    check: false,
  });
  const [editId, setEditedId] = useState();
  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
    payment: false,
  });
  const [onSearchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);
  const [files, setFiles] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [asc, setAsc] = useState(false);
  const [dateRange, setDateRange] = useState(["", null]);
  const [startDate, endDate] = dateRange;
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const [receipt, setReceipt] = useState({});

  const getInvoices = async (page) => {
    try {
      const response = await axios.post(
        `${API_URL}/invoices/getInvoicesByUserId`,
        {
          page,
          perPage: itemPerPage,
          invoice_id: onSearchText,
          user_id: user.id,
          asc,
          startDate,
          endDate,
        }
      );

      setInvoices(response.data.invoices);
      setTotalInvoices(response.data.count);

      console.log(paymentData);
    } catch (error) {
      console.log(error);
    }
  };

  // CONVERT PRICE TO CURRENCY TYPE
  const toCurrency = (data) => {
    const locale = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumSignificantDigits: 9,
    });
    return locale.format(data);
  };

  // GET IMAGE URL
  const getImageUrl = (image) => {
    return `${API_URL}/products/${image}`;
  };

  useEffect(() => {
    getInvoices(1);
    getPayment();
  }, [itemPerPage, asc, startDate, endDate]);

  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = productData.filter((item) => {
        return item.sku.toLowerCase().includes(onSearchText.toLowerCase());
      });
      setData([...filteredObject]);
    } else {
      setData([...productData]);
    }
  }, [onSearchText]);

  // OnChange function to get the input data
  const onInputChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const onInputImage = (e) => {
    setImage(e.target.files[0]);
  };

  // SUBMIT PAYMENT
  const submitPayment = async () => {
    try {
      // let path = payment.image;
      // const filename = path.replace(/C:\\fakepath\\/, "");

      if (!payment.bank) return setErrMsg("Please choose your bank");
      if (!payment.account_name)
        return setErrMsg("Please insert your account name");
      if (!payment.amount) return setErrMsg("Please insert amount");
      if (!image) return setErrMsg("Receipt image is required");

      let form = new FormData();
      form.append("image", image);
      for (let key in payment) {
        form.append(key, payment[key]);
      }
      console.log(form);

      await axios.post(`${API_URL}/payment/add-payment-receipt`, form);
      setView({ payment: false });
    } catch (error) {
      console.log(error);
    }
  };

  // GET PAYMENT
  const getPayment = async () => {
    try {
      const response = await axios.get(`${API_URL}/payment/get-payment`);

      const tempPaymentData = response.data.response.map(
        ({ invoice_id }) => invoice_id
      );

      setPaymentData(tempPaymentData);
    } catch (error) {
      console.log(error);
    }
  };

  // category change
  const onCategoryChange = (value) => {
    setFormData({ ...formData, category: value });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setView({ edit: false, add: false, details: false, payment: false });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      img: null,
      sku: "",
      price: 0,
      stock: 0,
      category: [],
      fav: false,
      check: false,
    });
    reset({});
  };

  const onFormSubmit = (form) => {
    const { title, price, sku, stock } = form;
    let submittedData = {
      id: data.length + 1,
      name: title,
      img: files.length > 0 ? files[0].preview : ProductH,
      sku: sku,
      price: price,
      stock: stock,
      category: formData.category,
      fav: false,
      check: false,
    };
    setData([submittedData, ...data]);
    setView({ open: false });
    setFiles([]);
    resetForm();
  };

  const onEditSubmit = () => {
    let submittedData;
    let newItems = data;
    let index = newItems.findIndex((item) => item.id === editId);

    newItems.forEach((item) => {
      if (item.id === editId) {
        submittedData = {
          id: editId,
          name: formData.name,
          img: files.length > 0 ? files[0].preview : item.img,
          sku: formData.sku,
          price: formData.price,
          stock: formData.stock,
          category: formData.category,
          fav: false,
          check: false,
        };
      }
    });
    newItems[index] = submittedData;
    //setData(newItems);
    resetForm();
    setView({ edit: false, add: false });
  };

  // function that loads the want to editted data
  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item.id === id) {
        setFormData({
          name: item.name,
          img: item.img,
          sku: item.sku,
          price: item.price,
          stock: item.stock,
          category: item.category,
          fav: false,
          check: false,
        });
      }
    });
    setEditedId(id);
    setFiles([]);
    setView({ add: false, edit: true });
  };

  // function allows only number

  // CONFIRM PAYMENT
  const confirmPayment = async () => {
    try {
      setView({ payment: true });
    } catch (error) {
      console.log(error);
    }
  };

  // selects all the products
  const selectorCheck = (e) => {
    let newData;
    newData = data.map((item) => {
      item.check = e.currentTarget.checked;
      return item;
    });
    setData([...newData]);
  };

  // selects one product
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].check = e.currentTarget.checked;
    setData([...newData]);
  };

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to delete a product
  const deleteProduct = (id) => {
    let defaultData = data;
    defaultData = defaultData.filter((item) => item.id !== id);
    setData([...defaultData]);
  };

  // function to delete the seletected item
  const selectorDeleteProduct = () => {
    let newData;
    newData = data.filter((item) => item.check !== true);
    setData([...newData]);
  };

  // toggle function to view product details
  const toggle = (type) => {
    setView({
      edit: type === "edit" ? true : false,
      add: type === "add" ? true : false,
      details: type === "details" ? true : false,
    });
  };

  // handles ondrop function of dropzone
  const handleDropChange = (acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  };

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = invoices.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { errors, register, handleSubmit, reset } = useForm();

  console.log(payment);
  // console.log(image.image);
  return (
    <React.Fragment>
      <Head title="Transaction List"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Transactions</BlockTitle>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <a
                  href="#more"
                  className="btn btn-icon btn-trigger toggle-expand mr-n1"
                  onClick={(ev) => {
                    ev.preventDefault();
                    updateSm(!sm);
                  }}
                >
                  <Icon name="more-v"></Icon>
                </a>
                <div
                  className="toggle-expand-content"
                  style={{ display: sm ? "block" : "none" }}
                >
                  <ul className="nk-block-tools g-3">
                    <li>
                      <div className="form-control-wrap">
                        <div className="form-icon form-icon-right">
                          <Icon name="search"></Icon>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="default-04"
                          placeholder="Quick search"
                          onChange={(e) => onFilterChange(e)}
                        />
                      </div>
                    </li>
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          color="transparent"
                          className="dropdown-toggle dropdown-indicator btn btn-outline-light btn-white"
                        >
                          Status
                        </DropdownToggle>
                        <DropdownMenu right>
                          <ul className="link-list-opt no-bdr">
                            {/* <li>
                              <DropdownItem tag="a" href="#dropdownitem" onClick={(ev) => ev.preventDefault()}>
                                <span>Waiting Payment</span>
                              </DropdownItem>
                            </li> */}
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => ev.preventDefault()}
                              >
                                <span>Pending</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={(ev) => ev.preventDefault()}
                              >
                                <span>Approved</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li className="nk-block-tools-opt">
                      <Button
                        className="toggle btn-icon d-md-none"
                        color="primary"
                        onClick={() => {
                          toggle("add");
                        }}
                      >
                        <Icon name="plus"></Icon>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <Card>
            <div className="card-inner-group">
              <div className="card-inner p-0">
                <DataTableBody>
                  <DataTableHead>
                    <DataTableRow>
                      <span>ID</span>
                    </DataTableRow>
                    <DataTableRow size="sm">
                      <span>Products</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Total Price</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Payment</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span>Address</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span>Status</span>
                    </DataTableRow>
                    <DataTableRow className="nk-tb-col-tools"></DataTableRow>
                  </DataTableHead>
                  {invoices.length > 0
                    ? invoices.map((item) => {
                        return (
                          <DataTableItem key={item.id}>
                            <DataTableRow>
                              <b className="tb-sub">{item.invoice_id}</b>
                            </DataTableRow>
                            <DataTableRow size="sm">
                              <span className="tb-product">
                                <img
                                  src={getImageUrl(
                                    item.invoice_details[0].product.image
                                  )}
                                  alt="product"
                                  className="thumb"
                                />
                                {item.invoice_details.length > 0 ? (
                                  <span className="title">
                                    {item.invoice_details[0].product.name}{" "}
                                    <i
                                      style={{
                                        fontSize: "75%",
                                        fontWeight: "lighter",
                                      }}
                                    >
                                      +{item.invoice_details.length - 1}{" "}
                                      {item.invoice_details.length - 1 === 1
                                        ? "product"
                                        : "products"}
                                    </i>
                                  </span>
                                ) : (
                                  `${item.invoice_details[0].product.name}`
                                )}
                              </span>
                            </DataTableRow>

                            <DataTableRow>
                              <span className="tb-sub">
                                {toCurrency(item.grand_total)}
                              </span>
                            </DataTableRow>
                            <DataTableRow>
                              {paymentData.includes(item.invoice_id) ? (
                                <Button
                                  disabled
                                  color="primary"
                                  size="sm"
                                  className="btn btn-dim"
                                >
                                  Receipt Submitted
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => {
                                    confirmPayment();
                                    setPayment({ invoice_id: item.invoice_id });
                                  }}
                                  color="primary"
                                  size="sm"
                                  className="btn btn-dim"
                                >
                                  Confirm Payment
                                </Button>
                              )}
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span className="tb-sub">
                                {userAddress[0].name}
                              </span>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span className="tb-odr-status">
                                <Badge
                                  color={
                                    item.status === "Paid"
                                      ? "success"
                                      : item.status === "Waiting for payment"
                                      ? "warning"
                                      : "danger"
                                  }
                                  className="badge-dot"
                                >
                                  {item.status}
                                </Badge>
                              </span>
                            </DataTableRow>
                            <DataTableRow className="nk-tb-col-tools">
                              <ul className="nk-tb-actions gx-1 my-n1">
                                <li className="mr-n1">
                                  <UncontrolledDropdown>
                                    <DropdownToggle
                                      tag="a"
                                      href="#more"
                                      onClick={(ev) => ev.preventDefault()}
                                      className="dropdown-toggle btn btn-icon btn-trigger"
                                    >
                                      <Icon name="more-h"></Icon>
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                      <ul className="link-list-opt no-bdr">
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#view"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              onEditClick(item.id);
                                              toggle("details");
                                            }}
                                          >
                                            <Icon name="eye"></Icon>
                                            <span>View Transaction</span>
                                          </DropdownItem>
                                        </li>
                                        <li>
                                          <DropdownItem
                                            tag="a"
                                            href="#remove"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                              deleteProduct(item.id);
                                            }}
                                          >
                                            <Icon name="trash"></Icon>
                                            <span>Cancel Transaction</span>
                                          </DropdownItem>
                                        </li>
                                      </ul>
                                    </DropdownMenu>
                                  </UncontrolledDropdown>
                                </li>
                              </ul>
                            </DataTableRow>
                          </DataTableItem>
                        );
                      })
                    : null}
                </DataTableBody>
                <div className="card-inner">
                  {data.length > 0 ? (
                    <PaginationComponent
                      itemPerPage={itemPerPage}
                      totalItems={data.length}
                      paginate={paginate}
                      currentPage={currentPage}
                    />
                  ) : (
                    <div className="text-center">
                      <span className="text-silent">No products found</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Block>

        <Modal
          isOpen={view.details}
          toggle={() => onFormCancel()}
          className="modal-dialog-centered"
          size="lg"
        >
          <ModalBody>
            <a href="#cancel" className="close">
              {" "}
              <Icon
                name="cross-sm"
                onClick={(ev) => {
                  ev.preventDefault();
                  onFormCancel();
                }}
              ></Icon>
            </a>
            <div className="nk-modal-head">
              <h4 className="nk-modal-title title">
                Product <small className="text-primary">#{formData.sku}</small>
              </h4>
              <img src={formData.img} alt="" />
            </div>
            <div className="nk-tnx-details mt-sm-3">
              <Row className="gy-3">
                <Col lg={6}>
                  <span className="sub-text">Product Name</span>
                  <span className="caption-text">{formData.name}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Product Price</span>
                  <span className="caption-text">$ {formData.price}</span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Product Category</span>
                  <span className="caption-text">
                    {formData.category.map((item, index) => (
                      <Badge key={index} className="mr-1" color="secondary">
                        {item.value}
                      </Badge>
                    ))}
                  </span>
                </Col>
                <Col lg={6}>
                  <span className="sub-text">Stock</span>
                  <span className="caption-text"> {formData.stock}</span>
                </Col>
              </Row>
            </div>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={view.payment}
          toggle={() => onFormCancel()}
          className="modal-dialog-centered"
          size="sm"
        >
          <ModalBody>
            <div className="nk-modal-head">
              <div>
                <a href="#cancel" className="close">
                  {" "}
                  <Icon
                    name="cross-sm"
                    onClick={(ev) => {
                      ev.preventDefault();
                      onFormCancel();
                      setErrMsg("");
                    }}
                  ></Icon>
                </a>
                <div className="nk-modal-head">
                  <h4 className="nk-modal-title title">
                    Confirm Payment
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
                          <span>Bank</span>
                          <span>
                            <Form encType="multipart/form-data">
                              <FormGroup>
                                <Input
                                  onChange={(e) => onInputChange(e)}
                                  type="select"
                                  name="bank"
                                  required
                                  // title={errMsg.bank}
                                >
                                  <option id="bri" value="BNI">
                                    Bank BRI
                                  </option>
                                  <option id="bca" value="BCA">
                                    Bank BCA
                                  </option>
                                  <option id="mandiri" value="MANDIRI">
                                    Bank Mandiri
                                  </option>
                                  <option id="bni" value="BNI">
                                    Bank BNI
                                  </option>
                                  <option id="cimb" value="CIMB">
                                    Bank CIMB
                                  </option>
                                  <option id="btn" value="BTN">
                                    Bank BTN
                                  </option>
                                </Input>
                              </FormGroup>
                            </Form>
                          </span>
                        </li>
                        <li
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                          className="py-1"
                        >
                          <span>Account Name</span>
                          <span>
                            <Form encType="multipart/form-data">
                              <FormGroup>
                                <Input
                                  pattern="[A-Za-z]"
                                  style={{ width: "131px" }}
                                  name="account_name"
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
                          <span>Amount</span>
                          <span>
                            <Form encType="multipart/form-data">
                              <FormGroup>
                                <Input
                                  type="number"
                                  style={{ width: "131px" }}
                                  placeholder="ex: 2000000"
                                  name="amount"
                                  onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                      event.preventDefault();
                                    }
                                  }}
                                  onChange={(e) => {
                                    onInputChange(e);
                                  }}
                                  required
                                  // title={errMsg.amount}
                                ></Input>
                              </FormGroup>
                            </Form>
                          </span>
                          {/* <b>{toCurrency(invoices[0].grand_total)}</b> */}
                        </li>
                        <li
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                          className="py-1"
                        >
                          <span>Upload Receipt</span>
                          <span>
                            <Form encType="multipart/form-data">
                              <FormGroup>
                                <input
                                  type="file"
                                  id="img"
                                  name="image"
                                  accept="image/*"
                                  style={{
                                    width: "131px",
                                    textDecoration: "underline",
                                    fontStyle: "italic",
                                    cursor: "pointer",
                                  }}
                                  onChange={(e) => {
                                    onInputImage(e);
                                  }}
                                  required
                                  // title={errMsg.image}
                                ></input>
                              </FormGroup>
                            </Form>
                            {/* <label
                              style={{
                                width: "131px",
                                textDecoration: "underline",
                                fontStyle: "italic",
                                cursor: "pointer",
                              }}
                              for="img"
                            >
                              Upload receipt
                            </label> */}
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
                      onClick={() => submitPayment()}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>

        {view.add && <div className="toggle-overlay" onClick={toggle}></div>}
      </Content>
    </React.Fragment>
  );
};

export default TransactionList;
