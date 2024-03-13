/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Group, Table, Text } from "@mantine/core";
import React from "react";
import Head from "../../components/Head";
import Layout from "../../layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators, asyncAction, State } from "../../state";
import { useEffect } from "react";
import Loading from "../../components/Loading";
import moment from "moment";
import { useNotifications } from "@mantine/notifications";

const UsersList = () => {
  const dispatch = useDispatch();
  const notifications = useNotifications();

  const { getUsers, } = bindActionCreators(actionCreators, dispatch);

  const { users, error, loading } = useSelector((state: State) => state.users);

  useEffect(() => {
    dispatch(asyncAction(getUsers(1)));
  }, [dispatch]);
  useEffect(() => {
    if (error) {
      notifications.showNotification({
        title: "Oh no!",
        message: error && error.message,
        color: "red",
      });
    }
  }, [error, notifications]);

  return (
    <Layout>
      <Head title="Users List | Admin" />

      <Card shadow="md" radius="lg" withBorder>
        <Group sx={{ marginBottom: "1rem" }} direction="row" position="apart">
          <Text weight={700}>Users</Text>
        </Group>
        {loading ? (
          <Loading />
        ) : (
          <Group position="center" direction="column">
            <Table horizontalSpacing="xl" verticalSpacing="xs" highlightOnHover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Last Login</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {users
                  ? users.map((user: any) => (
                      <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                        {user.role === 0 ? 'User' : 'Admin'}
                        </td>
                        <td>{user.phone}</td>
                        <td>
                          {moment(user.last_login_at).format("DD-MMM-YYYY hh:mm")}
                        </td>
                        <td>
                          {moment(user.createdAt).format("DD-MMM-YYYY hh:mm")}
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </Table>
          </Group>
        )}
      </Card>
    </Layout>
  );
};

export default UsersList;
