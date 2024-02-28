/* eslint-disable react-hooks/exhaustive-deps */
import {
  Badge,
  Button,
  Card,
  Col,
  Grid,
  List,
  PasswordInput,
  Table,
  Text,
  TextInput
} from "@mantine/core";
import Layout from "../layout/Layout";
import { useNavigate } from "react-router";
import { useForm } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNotifications } from "@mantine/notifications";
import Head from "../components/Head";
import { bindActionCreators } from "redux";
import { actionCreators, State } from "../state";
import Loading from "../components/Loading";
import React from "react";
import moment from "moment";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useNotifications();

  const { logout, getMyOrders, updateProfile } = bindActionCreators(
    actionCreators,
    dispatch
  );

  const { userInfo, error } = useSelector((state: State) => state.userLogin);

  const { profileUpdate } = useSelector((state: State) => state.profileUpdate);

  const {
    myOrders,
    loading: myOrdersLoading,
    error: myOrdersError,
  } = useSelector((state: State) => state.myOrders);

  const form = useForm({
    initialValues: {
      email: userInfo && userInfo.email,
      username: userInfo && userInfo.username,
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

  const rows =
    myOrders &&
    myOrders.data 
    ?
    myOrders.data.map((order: any) => (
      <tr key={order._id}>
        <td>
          <List size="sm">
            {order.orderItems.map((item: any) => {
              return (
                <List.Item>
                  {item.name} x {item.qty}
                </List.Item>
              );
            })}
          </List>
        </td>
        <td>
          <Text size="sm" weight={600}>
            {" "}
            {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
            {order.shippingAddress.country}, {order.shippingAddress.postalCode}
          </Text>
        </td>
        <td>
          <Text size="sm" weight={600}>
            {moment(order.createdAt).format(
                "DD-MM-YYYY hh:mm"
              )})
          </Text>
        </td>
        <td>
          <Text size="sm" weight={600}>
            ${order.totalPrice}
          </Text>
        </td>
        <td>
          {order.isPaid ? (
            <Badge radius="lg" variant="filled" color="green">
              {`Paid | ${moment(order.paidAt).format("DD-MMM-YYYY HH:mm")}`}
            </Badge>
          ) : (
            <Badge radius="lg" variant="filled" color="red">
              Not Paid
            </Badge>
          )}
        </td>
        <td>
          {order.isDelivered ? (
            <Badge radius="lg" variant="filled" color="green">
              {`Delivered | ${moment(order.deliveredAt).format(
                "DD-MMM-YYYY hh:mm"
              )}`}
            </Badge>
          ) : (
            <Badge radius="lg" variant="filled" color="red">
              Not Delivered
            </Badge>
          )}
        </td>
      </tr>
    )):null;
  const handlerEditProfile = (values: any) => {
    const { username, email, password } = values;
    updateProfile(username, email, password);
    form.reset();
  };

  const handlerLogout = () => {
    logout();
    navigate("/");
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
      getMyOrders();
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
          {!userInfo && ( <Card withBorder shadow="xs" radius="lg" padding="xl">
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
          </Card>)}
          <Card
            sx={{ marginTop: "2rem" }}
            withBorder
            shadow="xs"
            radius="lg"
            padding="xl"
          >
            <Text weight={700}>User Profile</Text>
            <form
              onSubmit={form.onSubmit((values) => handlerEditProfile(values))}
            >
              <Grid sx={{ marginTop: "10px" }}>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} span={6}>
                  <TextInput
                    radius="lg"
                    label="Your username"
                    placeholder="Username"
                    {...form.getInputProps("username")}
                    // error={form.errors.username}
                    
                  />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} span={6}>
                  {" "}
                  <TextInput
                    radius="lg"
                    label="Your email"
                    placeholder="email"
                    {...form.getInputProps("email")}
                    // error={form.errors.email}
                    
                    // disabled
                  />
                </Col>

                <Col xs={12} sm={12} md={6} lg={6} xl={6} span={6}>
                  {" "}
                  <PasswordInput
                    radius="lg"
                    label="Your password"
                    placeholder="Password"
                    {...form.getInputProps("password")}
                    // error={form.errors.password}
                    // required
                    // disabled
                  />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} span={6}>
                  {" "}
                  <PasswordInput
                    radius="lg"
                    label="Confirm password"
                    placeholder="Confirmation"
                    {...form.getInputProps("confirmpassword")}
                    // error={form.errors.confirmpassword}
                    // required
                    // disabled
                  />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6} span={6}>
                  <Button type="submit" radius="lg" color="dark" fullWidth
>
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
            <Text weight={700}>My Orders</Text>
            {myOrdersLoading ? (
              <Loading />
            ) : (
              <Grid sx={{ marginTop: "10px" }}>
                <Col span={12}>
                  {myOrders && (
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
                      <tbody>{rows}</tbody>
                    </Table>
                  )}
                </Col>
              </Grid>
            )}
          </Card>
        </>
      )}
    </Layout>
  );
};

export default Profile;
