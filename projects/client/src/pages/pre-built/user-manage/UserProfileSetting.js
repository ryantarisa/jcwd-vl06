import React from "react";
import Head from "../../../layout/head/Head";
import { Card } from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  InputSwitch,
  Button,
} from "../../../components/Component";
import { Link } from "react-router-dom";

const UserProfileSettingPage = ({ sm, updateSm }) => {
  const user = JSON.parse(window.localStorage.getItem("profile"));
  return (
    <React.Fragment>
      <Head title="User List - Profile"></Head>

      <BlockHead size="lg">
        <BlockBetween>
          <BlockHeadContent>
            <BlockTitle tag="h4">Security Settings</BlockTitle>
            <BlockDes>
              <p>These settings will help you to keep your account secure.</p>
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
        <Card className="card-bordered">
          <div className="card-inner-group">
            <div className="card-inner">
              <div className="between-center flex-wrap g-3">
                <div className="nk-block-text">
                  <h6>Change Password</h6>
                  <p>Set a unique password to protect your account.</p>
                </div>
                <div className="nk-block-actions flex-shrink-sm-0">
                  <ul className="align-center flex-wrap flex-sm-nowrap gx-3 gy-2">
                    <Link
                      to={`${process.env.PUBLIC_URL}/reset-password/${user.uuid}`}
                    >
                      <li className="order-md-last">
                        <Button color="primary">Change Password</Button>
                      </li>
                    </Link>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Block>
    </React.Fragment>
  );
};
export default UserProfileSettingPage;
