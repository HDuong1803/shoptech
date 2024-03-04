import {
  Button,
  Card,
  Group,
  Switch,
  Table,
  Text,
} from "@mantine/core";
import React from "react";
import Head from "../../components/Head";
import Layout from "../../layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators, State } from "../../state";
import { useEffect } from "react";
import Loading from "../../components/Loading";
import moment from "moment";
import { BiTrashAlt } from "react-icons/bi";
import { useNotifications } from "@mantine/notifications";

const UsersList = () => {
  const dispatch = useDispatch();
  const notifications = useNotifications();

  const { getUser, updateUser } = bindActionCreators(actionCreators, dispatch);

  const { user, error, loading } = useSelector((state: State) => state.user);
  const { userUpdate: updateUserRole, error: userUpdateError } = useSelector(
    (state: State) => state.userUpdate
  );

  const handlerUpdateUser = (id: string, isAdmin: boolean) => {
    updateUser(id, isAdmin);
  };

  useEffect(() => {
    getUser();
  }, [dispatch, getUser, updateUserRole]);

  useEffect(() => {
    if (error || userUpdateError) {
      notifications.showNotification({
        title: "Oh no!",
        message: error && error.message,
        color: "red",
      });
    }
  }, [error, notifications, userUpdateError]);

  const rows =
    user &&
    Object.keys(user).length >= 3 &&
    user.map((user: any) => (
      <tr key={user._id}>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>
          <Switch
            checked={user.isAdmin ? true : false}
            onChange={() =>
              handlerUpdateUser(user._id, !user.isAdmin ? true : false)
            }
            disabled
          />
        </td>
        <td>{moment(user.created_at).format("DD-MMM-YYYY hh:mm")}</td>
        <td>
          <Button color="red" radius="lg" disabled>
            <BiTrashAlt />
          </Button>
        </td>
      </tr>
    ));

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
                  <th>Is Admin</th>
                  <th>Joined Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Group>
        )}
      </Card>
    </Layout>
  );
};

export default UsersList;
