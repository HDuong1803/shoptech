/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Badge,
  Box,
  Button,
  Card,
  Col,
  Grid,
  List,
  PasswordInput,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import Layout from "../layout/Layout";
import { useNavigate } from "react-router";
import { useForm } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNotifications } from "@mantine/notifications";
import Head from "../components/Head";
import { bindActionCreators } from "redux";
import { actionCreators, asyncAction, State } from "../state";
import React from "react";
import moment from "moment";
import { NavLink } from "react-router-dom";
import { BiUser } from "react-icons/bi";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useNotifications();
  const { logout, getMyOrders, updateProfile, getUser } = bindActionCreators(
    actionCreators,
    dispatch
  );
  const { user } = useSelector((state: State) => state.user);
  const { userInfo, error } = useSelector((state: State) => state.userLogin);
  const { profileUpdate } = useSelector((state: State) => state.profileUpdate);
  const [myOrder, setMyOrder] = useState([]);
  const {
    myOrders,
    loading: myOrdersLoading,
    error: myOrdersError,
  } = useSelector((state: State) => state.myOrders);
  const form = useForm({
    initialValues: {
      email: userInfo && user?.email,
      username: userInfo && user?.username,
      phone: "",
      password: "",
      confirmpassword: "",
    },
    validationRules: {
      email: (value) => /^\S+@\S+$/.test(value),
      username: (value) => value.trim().length > 1,
      phone: (value) => value.trim().length === 10,
      password: (value) => value.trim().length >= 6,
      confirmpassword: (confirmPassword, values) =>
        confirmPassword === values?.password,
    },
    errorMessages: {
      username: "Name should be more than 2 characters or longer",
      email: "Email is not valid",
      phone: "Phone number is not valid",
      password: "Password should be 6 characters or longer",
      confirmpassword: "Passwords does not match",
    },
  });

  const handlerEditProfile = (values: any) => {
    const { username, email, password } = values;
    updateProfile(username, email, password);
    form.reset();
  };

  const handlerLogout = () => {
    logout();
    navigate("/");
  };

  const handlerGetMyOrder = () => {
    setMyOrder(myOrders);
  };
  useEffect(() => {
    if (Object.keys(profileUpdate).length !== 0) {
      notifications.showNotification({
        title: "Success!",
        message: "Profile Updated",
        color: "green",
      });
    }
  }, [profileUpdate]);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else if (userInfo) {
      dispatch(asyncAction(getUser()));
      dispatch(asyncAction(getMyOrders()));
      if (error || myOrdersError) {
        notifications.showNotification({
          title: "Error!",
          message: error,
          color: "red",
        });
      }
    }
  }, [dispatch, userInfo]);

  return (
    <Layout>
      <Head title="Profile | Techstop" description="Shop for gadgets" />
      {userInfo && (
        <>
          {!userInfo && (
            <Card withBorder shadow="xs" radius="lg" padding="xl">
              <Grid>
                <Col span={1}>
                  <Text weight={700}>Admin</Text>
                </Col>
                <Col xs={12} sm={3} md={3} lg={3} xl={4} span={4}>
                  <Button
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan" }}
                    radius="lg"
                    onClick={() => navigate("/admin/orders")}
                    fullWidth
                  >
                    Manage Orders
                  </Button>
                </Col>
                <Col xs={12} sm={3} md={3} lg={3} xl={3} span={3}>
                  <Button
                    variant="gradient"
                    gradient={{ from: "teal", to: "lime", deg: 105 }}
                    radius="lg"
                    onClick={() => navigate("/admin/products")}
                    fullWidth
                  >
                    Manage Products
                  </Button>
                </Col>
                <Col xs={12} sm={3} md={3} lg={3} xl={4} span={4}>
                  <Button
                    variant="gradient"
                    gradient={{ from: "orange", to: "red" }}
                    radius="lg"
                    onClick={() => navigate("/admin/users")}
                    fullWidth
                  >
                    Manage Users
                  </Button>
                </Col>
              </Grid>
            </Card>
          )}
          <Card
            sx={{ marginTop: "2rem", width:500 }}
            withBorder
            shadow="xs"
            radius="lg"
            padding="xl"
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
            <BiUser size={100}/>
              <Box sx={{ marginLeft: "4rem" }}>
                <Text weight={700}>Name: {user?.username}</Text>
                <Text weight={700}>Email: {user?.email}</Text>
                <Text weight={700}>Phone: {user?.phone}</Text>
              </Box>
            </Box>
          </Card>
          <Card
            sx={{ marginTop: "2rem" }}
            withBorder
            shadow="xs"
            radius="lg"
            padding="xl"
          >
            <Text weight={700}>Update Profile</Text>
            <form
              onSubmit={form.onSubmit((values) => handlerEditProfile(values))}
            >
              <Grid sx={{ marginTop: "10px" }}>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} span={6}>
                  <TextInput
                    radius="lg"
                    label="Your username"
                    placeholder="Username"
                    value={user?.username}
                    {...form.getInputProps("username")}
                    error={form.errors.username}
                  />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} span={6}>
                  {" "}
                  <TextInput
                    radius="lg"
                    label="Your email"
                    placeholder="email"
                    value={user?.email}
                    {...form.getInputProps("email")}
                    error={form.errors.email}
                    disabled
                  />
                </Col>

                <Col xs={12} sm={12} md={6} lg={6} xl={6} span={6}>
                  {" "}
                  <PasswordInput
                    radius="lg"
                    label="Your password"
                    placeholder="Password"
                    {...form.getInputProps("password")}
                    error={form.errors.password}
                    required
                  />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} span={6}>
                  {" "}
                  <PasswordInput
                    radius="lg"
                    label="Confirm password"
                    placeholder="Confirmation"
                    {...form.getInputProps("confirmpassword")}
                    error={form.errors.confirmpassword}
                    required
                  />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} span={6}>
                  <Button type="submit" radius="lg" color="dark" fullWidth>
                    Update Profile
                  </Button>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} span={6}>
                  <Button
                    radius="lg"
                    color="red"
                    fullWidth
                    onClick={() => handlerLogout()}
                  >
                    Log Out
                  </Button>
                </Col>
              </Grid>
            </form>
          </Card>

          <Card
            sx={{ marginTop: "2rem" }}
            withBorder
            shadow="xs"
            radius="lg"
            padding="xl"
          >
            <Grid
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Col span={6}>
                <Text weight={700} style={{ lineHeight: "36px" }}>
                  My Orders
                </Text>
              </Col>
              <Col span={6} style={{ display: "flex", justifyContent: "end" }}>
                <Button
                  onClick={() => handlerGetMyOrder()}
                  color="dark"
                  variant="filled"
                  sx={{ margin: "10px" }}
                  radius="lg"
                  size="sm"
                >
                  {" "}
                  View All
                </Button>
              </Col>
            </Grid>
            <Table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                </tr>
              </thead>
              <tbody>
                {myOrder && myOrder.length
                  ? myOrder.map((order: any) => (
                      <tr key={order._id}>
                        <td>
                          <NavLink
                            to={`/order/${order._id}`}
                            style={{ textDecoration: "none", color: "#000" }}
                          >
                            <List size="sm">
                              {order.order_items ? (
                                order.order_items.map((item: any) => {
                                  return (
                                    <List.Item>
                                      {item.name} x {item.quantity}
                                    </List.Item>
                                  );
                                })
                              ) : (
                                <></>
                              )}
                            </List>
                          </NavLink>
                        </td>
                        <td>
                          <NavLink
                            to={`/order/${order._id}`}
                            style={{ textDecoration: "none", color: "#000" }}
                          >
                            <Text size="sm" weight={600}>
                              {" "}
                              {order.shipping_address.address},{" "}
                              {order.shipping_address.city},{" "}
                              {order.shipping_address.country},{" "}
                              {order.shipping_address.postal_code}
                            </Text>
                          </NavLink>
                        </td>

                        <td>
                          <NavLink
                            to={`/order/${order._id}`}
                            style={{ textDecoration: "none", color: "#000" }}
                          >
                            <Text size="sm" weight={600}>
                              {moment(order.created_at).format(
                                "DD-MM-YYYY hh:mm"
                              )}
                            </Text>
                          </NavLink>
                        </td>
                        <td>
                          <NavLink
                            to={`/order/${order._id}`}
                            style={{ textDecoration: "none", color: "#000" }}
                          >
                            <Text size="sm" weight={600}>
                              ${order.total_price}
                            </Text>
                          </NavLink>
                        </td>
                        <td>
                          <NavLink
                            to={`/order/${order._id}`}
                            style={{ textDecoration: "none", color: "#000" }}
                          >
                            {order.is_paid ? (
                              <Badge radius="lg" variant="filled" color="green">
                                {`Paid | ${moment(order.paid_at).format(
                                  "DD-MMM-YYYY HH:mm"
                                )}`}
                              </Badge>
                            ) : (
                              <Badge radius="lg" variant="filled" color="red">
                                Not Paid
                              </Badge>
                            )}
                          </NavLink>
                        </td>
                        <td>
                          <NavLink
                            to={`/order/${order._id}`}
                            style={{ textDecoration: "none", color: "#000" }}
                          >
                            {order.is_delivered ? (
                              <Badge radius="lg" variant="filled" color="green">
                                {`Delivered | ${moment(
                                  order.delivered_at
                                ).format("DD-MMM-YYYY hh:mm")}`}
                              </Badge>
                            ) : (
                              <Badge radius="lg" variant="filled" color="red">
                                Not Delivered
                              </Badge>
                            )}
                          </NavLink>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </Table>
          </Card>
        </>
      )}
    </Layout>
  );
};

export default Profile;