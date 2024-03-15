/* eslint-disable react-hooks/exhaustive-deps */
import {
  Badge,
  Card,
  Group,
  List,
  Pagination,
  Switch,
  Table,
  Text
} from '@mantine/core'
import Head from '../../components/Head'
import Layout from '../../layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actionCreators, asyncAction, State } from '../../state'
import { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import moment from 'moment'
import { useNotifications } from '@mantine/notifications'
import { ActionType } from '../../state/action-types'
import React from 'react'

const OrdersList = () => {
  const dispatch = useDispatch()
  const notifications = useNotifications()

  const [activePage, setActivePage] = useState(1)

  const { getOrders, deliverOrder } = bindActionCreators(
    actionCreators,
    dispatch
  )

  const { orders, error, loading } = useSelector((state: State) => state.orders)

  const { success, error: orderDeliverError } = useSelector(
    (state: State) => state.orderDeliver
  )

  const handlerDeliverOrder = (orderId: string) => {
    dispatch(asyncAction(deliverOrder(orderId)))
  }

  const handlerPageChange = (page: number) => {
    setActivePage(page)
    getOrders(page)
  }

  useEffect(() => {
    setActivePage(1)
    dispatch(asyncAction(getOrders(1)))
  }, [dispatch])

  useEffect(() => {
    if (orderDeliverError || error) {
      notifications.showNotification({
        title: 'Oh no!',
        message: error && error.message,
        color: 'red'
      })
    }
  }, [error, orderDeliverError])

  useEffect(() => {
    if (success) {
      notifications.showNotification({
        title: 'Success!',
        message: 'Marked as Delivered',
        color: 'green'
      })
    }

    dispatch({
      type: ActionType.ORDER_DELIVER_RESET
    })
  }, [success])

  return (
    <Layout>
      <Head title="Orders List | Admin" />

      <Card shadow="xl" radius="lg">
        <Group sx={{ marginBottom: '1rem' }} direction="row" position="apart">
          <Text weight={700}>Orders</Text>
        </Group>
        {loading ? (
          <Loading />
        ) : (
          <Group position="center" direction="column">
            <Table horizontalSpacing="xl" verticalSpacing="xs" highlightOnHover>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Order Items</th>
                  <th>Shipping Address</th>
                  <th>Total Price</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                  <th>Mark as Delivered</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.length
                  ? orders.map((order: any) => (
                      <tr key={order._id}>
                        <td>
                          <Text size="sm" weight={600}>
                            {order.username}
                          </Text>
                        </td>
                        <td>
                          <Text size="sm" weight={600}>
                            {order.email}
                          </Text>
                        </td>
                        <td>
                          <List size="sm">
                            {order.order_items.map((item: any) => {
                              return (
                                <List.Item>
                                  {item.name} x {item.quantity}
                                </List.Item>
                              )
                            })}
                          </List>
                        </td>
                        <td>
                          <Text size="sm" weight={600}>
                            {' '}
                            {order.shipping_address.address},{' '}
                            {order.shipping_address.city},{' '}
                            {order.shipping_address.country},{' '}
                            {order.shipping_address.postalCode}
                          </Text>
                        </td>
                        <td>
                          <Text size="sm" weight={600}>
                            ${order.total_price}
                          </Text>
                        </td>
                        <td>
                          {order.is_paid ? (
                            <Badge radius="lg" variant="filled" color="green">
                              {`Paid | ${moment(order.paid_at).format(
                                'DD-MMM-YYYY HH:mm'
                              )}`}
                            </Badge>
                          ) : (
                            <Badge radius="lg" variant="filled" color="red">
                              Not Paid
                            </Badge>
                          )}
                        </td>
                        <td>
                          {order.is_delivered ? (
                            <Badge radius="lg" variant="filled" color="green">
                              {`Delivered | ${moment(order.delivered_at).format(
                                'DD-MMM-YYYY hh:mm'
                              )}`}
                            </Badge>
                          ) : (
                            <Badge radius="lg" variant="filled" color="red">
                              Not Delivered
                            </Badge>
                          )}
                        </td>
                        <td>
                          {order.is_delivered ? (
                            '-'
                          ) : (
                            <Switch
                              checked={order.is_delivered}
                              onChange={() => handlerDeliverOrder(order._id)}
                              color="dark"
                            />
                          )}
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </Table>
            <Pagination
              total={Math.round(orders.total / orders.count)}
              page={activePage}
              color="dark"
              radius="xl"
              onChange={e => handlerPageChange(e)}
            />
          </Group>
        )}
      </Card>
    </Layout>
  )
}

export default OrdersList
