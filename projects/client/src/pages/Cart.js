import React, { useState, useEffect } from "react";
import Head from "../layout/head/Head";
import Content from "../layout/content/Content";
import {
  Block,
  BlockHead,
  BlockTitle,
  BlockBetween,
  BlockHeadContent,
  Icon,
  Button,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableItem,
  PaginationComponent,
} from "../components/Component";
import {
  Card,
  DropdownItem,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Badge,
} from "reactstrap";
import { productData, categoryOptions } from "./pre-built/products/ProductData";
import SimpleBar from "simplebar-react";
import { useForm } from "react-hook-form";
import ProductH from "../images/product/h.png";
import Dropzone from "react-dropzone";
import { Modal, ModalBody } from "reactstrap";
import { RSelect } from "../components/Component";
import axios from "axios";
import { API_URL } from "../constants/API";
import { useParams } from "react-router";

const CartList = () => {
  const user = JSON.parse(window.localStorage.getItem("profile"));

  const [cartData, setCartData] = useState([]);
  const [sm, updateSm] = useState(false);
  const [onSearchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState({ name: true, asc: true });
  const [view, setView] = useState({
    edit: false,
    add: false,
    details: false,
    deleted: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);
  const { id } = useParams();

  // GET CATEGORIES
  const getCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/getCategories`);
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // GET CART DATA
  const getCart = async (page) => {
    try {
      const response = await axios.get(`${API_URL}/cart/cart-item/${id}`, {
        name: onSearchText,
        sortBy,
        page,
        perPage: itemPerPage,
      });

      const tempCart = [];

      for (let item of response.data) {
        tempCart.push({
          id: item.product.id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          qty: item.qty,
          category: item.product.category.category,
          unit: item.product.unit,
        });
        // console.log(tempCart);
      }

      setCartData(tempCart.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCart(id);
    getCategories();
    totalPrice();
  }, [onSearchText, sortBy]);

  // console.log(cartData);

  // DELETE CART ITEM
  const delItem = async (product_id) => {
    try {
      // console.log(product_id, user.id);
      await axios.delete(`${API_URL}/cart/delete-cart-item`, {
        data: {
          user_id: user.id,
          product_id,
        },
      });
      setView({ deleted: true });
      getCart();
    } catch (error) {
      console.log(error);
    }
  };

  // CLOSING MODAL
  const onCloseModal = () => {
    setView({ deleted: false });
    setView({ checkout: false });
  };

  // UPDATE QUANTITY
  const updateQty = async (product_id, e) => {
    try {
      await axios.patch(`${API_URL}/cart/update-cart-item`, {
        product_id: product_id,
        user_id: user.id,
        qty: e,
      });
    } catch (error) {
      console.log(error);
    }
    getCart();
  };

  // INCREASING QUANTITY
  const increaseQty = (id) => {
    setCartData((current) =>
      current.map((obj) => {
        if (obj.id === id) {
          updateQty(obj.id, obj.qty + 1);
          return { ...obj, qty: obj.qty + 1 };
        }
        return obj;
      })
    );
  };

  // DECREASING QUANTITY
  const decreaseQty = (id) => {
    setCartData((current) =>
      current.map((obj) => {
        if (obj.id === id) {
          // console.log(obj);
          if (obj.qty !== 0) {
            updateQty(obj.id, obj.qty - 1);
            return { ...obj, qty: obj.qty - 1 };
          } else if (obj.qty === 1) {
            // delItem(obj.id);
          }
        }
        return obj;
      })
    );
  };

  // GET TOTAL PRICE
  const totalPrice = () => {
    let pricesArr = cartData.map(({ price }) => price);
    let qtyArr = cartData.map(({ qty }) => qty);

    let priceTotal = 0;
    for (let i = 0; i < pricesArr.length; i++) {
      priceTotal += pricesArr[i] * qtyArr[i];
    }

    return priceTotal;
  };

  // CONVERT PRICE TO CURRENCY TYPE
  const toCurrency = (data) => {
    const locale = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumSignificantDigits: 8,
    });
    return locale.format(data);
  };

  // GET IMAGE URL
  const getImageUrl = (image) => {
    return `${API_URL}/products/${image}`;
  };

  // CHECKOUT CART
  const checkoutCart = async () => {
    let qtyArr = cartData.map(({ qty }) => qty);
    console.log(qtyArr);

    try {
      if (qtyArr.includes(0)) {
        setView({ checkout: true });
      } else {
        return (window.location.href = `${process.env.PUBLIC_URL}/checkout`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = cartData.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    getCart(pageNumber);
  };

  return (
    <React.Fragment>
      <Head title="Cart"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle>Cart</BlockTitle>
              <div style={{ fontWeight: "normal", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  Total price:{" "}
                  <div
                    style={{
                      fontSize: "large",
                      fontWeight: "bold",
                      marginLeft: "5px",
                      color: "#293822",
                    }}
                  >
                    {" "}
                    {toCurrency(totalPrice())}
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: "normal", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  Total product:{" "}
                  <div style={{ fontWeight: "normal", marginLeft: "5px" }}>
                    {" "}
                    {cartData.length} products
                  </div>
                </div>
              </div>
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
                    <li className="nk-block-tools-opt">
                      <Button
                        className="toggle d-none d-md-inline-flex"
                        color="primary"
                        onClick={() => checkoutCart()}
                      >
                        <span>Checkout</span>
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
                    <DataTableRow size="sm">
                      <span>Name</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Price/unit</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Quantity</span>
                    </DataTableRow>
                    <DataTableRow>
                      <span>Unit</span>
                    </DataTableRow>
                    <DataTableRow size="md">
                      <span>Category</span>
                    </DataTableRow>
                    <DataTableRow className="nk-tb-col-tools"></DataTableRow>
                  </DataTableHead>
                  {currentItems.length > 0
                    ? currentItems.map((item) => {
                        // console.log(item);
                        return (
                          <DataTableItem key={item.id}>
                            <DataTableRow size="sm">
                              <span className="tb-product">
                                <img
                                  src={
                                    item.image
                                      ? getImageUrl(item.image)
                                      : ProductH
                                  }
                                  alt="product"
                                  className="thumb"
                                />
                                <span className="title">{item.name}</span>
                              </span>
                            </DataTableRow>
                            <DataTableRow>
                              <span className="tb-sub">
                                {toCurrency(item.price)}
                              </span>
                            </DataTableRow>
                            <DataTableRow>
                              {/*///////// QUANTITY EDIT ////////*/}
                              <div className="form-control-wrap number-spinner-wrap w-140px">
                                <button
                                  style={{
                                    borderRadius: "7px",
                                    border: "none",
                                    padding: "7px",
                                    backgroundColor: "",
                                  }}
                                  type="button"
                                  className="btn-icon number-spinner-btn number-minus"
                                  disabled={
                                    item.qty === 1 || item.qty === 0
                                      ? true
                                      : false
                                  }
                                  onClick={() => decreaseQty(item.id)}
                                >
                                  <Icon name="minus"></Icon>
                                </button>
                                <input
                                  type="number"
                                  style={{
                                    borderColor: "white",
                                    backgroundColor: "transparent",
                                  }}
                                  className="form-control number-spinner"
                                  value={item.qty}
                                  onChange={(e) =>
                                    updateQty(item.id, Number(e.target.value))
                                  }
                                />
                                <button
                                  style={{
                                    borderRadius: "7px",
                                    border: "none",
                                    padding: "7px",
                                    backgroundColor: "",
                                  }}
                                  type="button"
                                  className="btn-icon number-spinner-btn number-plus"
                                  onClick={() => increaseQty(item.id)}
                                >
                                  <Icon name="plus"></Icon>
                                </button>
                              </div>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span className="tb-sub">{item.unit}</span>
                            </DataTableRow>
                            <DataTableRow size="md">
                              <span className="tb-sub">{item.category}</span>
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
                                            style={{ cursor: "pointer" }}
                                            tag="a"
                                            onClick={() => delItem(item.id)}
                                          >
                                            <Icon name="trash"></Icon>
                                            <span>Remove Item</span>
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
                  {currentItems.length > 0 ? (
                    <PaginationComponent
                      itemPerPage={itemPerPage}
                      totalItems={cartData.length}
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
          isOpen={view.deleted}
          toggle={() => onCloseModal()}
          className="modal-dialog-centered"
          size="sm"
        >
          <ModalBody>
            <div className="nk-modal-head">
              <h3 className="caption-text center">Item removed</h3>
            </div>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={view.checkout}
          toggle={() => onCloseModal()}
          className="modal-dialog-centered"
          size="sm"
        >
          <ModalBody>
            <h4 className="center text-danger">
              <b>Oops!</b>
            </h4>
            <b className="caption-text center ">Quantity can't be 0</b>
          </ModalBody>
        </Modal>
      </Content>
    </React.Fragment>
  );
};

export default CartList;
