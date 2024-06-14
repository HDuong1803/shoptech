/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, Col, Grid, Image, Text } from '@mantine/core'
import { useNavigate } from 'react-router'
import Steps from '../components/Steps'
import Layout from '../layout/Layout'
import { BsCreditCard2Front, BsBox } from 'react-icons/bs'
import { useSelector, useDispatch } from 'react-redux'
import { actionCreators, asyncAction, State } from '../state'
import Head from '../components/Head'
import { bindActionCreators } from 'redux'
import { useEffect, useState } from 'react'
import React from 'react'

const PlaceOrder = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { createOrder } = bindActionCreators(actionCreators, dispatch)

  const { cartItem } = useSelector((state: State) => state.cart)

  const { shipping_address, payment_method } = useSelector(
    (state: State) => state.payment
  )

  const { orderCreate, loading: createOrderLoading } = useSelector(
    (state: State) => state.orderCreate
  )

  const [initialCartItems, setInitialCartItems] = useState([])

  const handlerOrderCreate = () => {
    dispatch(asyncAction(createOrder(shipping_address, payment_method)))
  }

  useEffect(() => {
    if (Object.keys(orderCreate).length) {
      navigate(`/order/${orderCreate._id}`)
    }
    if (cartItem.cart) {
      setInitialCartItems(cartItem.cart)
    }
  }, [createOrder, cartItem.cart])
  return (
    <Layout>
      <Head title="Place Order" />
      <Card withBorder shadow="sm" radius="lg" padding="xl">
        <Steps active={3} />
        <Grid sx={{ marginTop: '2rem' }}>
          <Col span={12}>
            <Text>Shipping Address</Text>
            <Grid>
              <Col span={12}>
                <Card
                  withBorder
                  shadow="xs"
                  radius="lg"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '10px 0'
                  }}
                >
                  <BsBox size="30" />
                  <Text
                    color="gray"
                    sx={{ marginLeft: '10px' }}
                    weight={500}
                    size="sm"
                  >
                    {shipping_address.postal_code}, {shipping_address.address},{' '}
                    {shipping_address.city}, {shipping_address.country}
                  </Text>
                </Card>
              </Col>
            </Grid>
          </Col>
          <Col span={12}>
            <Text>Payment Method</Text>
            <Grid>
              <Col span={12}>
                <Card
                  withBorder
                  shadow="xs"
                  radius="lg"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '10px 0'
                  }}
                >
                  <BsCreditCard2Front size="30" />
                  <Text
                    sx={{ marginLeft: '10px' }}
                    color="gray"
                    weight={500}
                    size="sm"
                  >
                    {payment_method}
                  </Text>
                </Card>
              </Col>
            </Grid>
          </Col>
          <Col sx={{ margin: '10px 0' }} span={12}>
            <Text>Order Items</Text>
            <Grid>
              <Col span={12}>
                {initialCartItems && initialCartItems.length ? (
                  initialCartItems.map((item: any) => {
                    return (
                      <Card
                        sx={{ margin: '10px 0' }}
                        padding="sm"
                        withBorder
                        shadow="xs"
                        radius="lg"
                      >
                        <Grid>
                          <Col
                            sx={{ display: 'flex', alignItems: 'center' }}
                            span={5}
                          >
                            <Image
                              radius="lg"
                              fit="contain"
                              height={40}
                              width={40}
                              src={item.image}
                            />
                          </Col>
                          <Col
                            sx={{ display: 'flex', alignItems: 'center' }}
                            span={3}
                          >
                            <Text align="left" color="gray" weight={600}>
                              {item.name}
                            </Text>
                          </Col>
                          <Col
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end'
                            }}
                            span={4}
                          >
                            <Text align="right" weight={600}>
                              {item.quantity} x ${item.price}
                            </Text>
                          </Col>
                        </Grid>
                      </Card>
                    )
                  })
                ) : (
                  <></>
                )}
              </Col>
            </Grid>
          </Col>
          <Col span={12}>
            <Text sx={{ margin: '10px 0' }}>Order Summary</Text>
            <Card withBorder shadow="xs" radius="lg">
              <Grid
                sx={{ margin: '10px 0', borderBottom: '1px solid #E0E0E0' }}
              >
                <Col span={6}>
                  <Text>Fee Shipping</Text>
                </Col>
                <Col span={6}>
                  <Text align="right">$0</Text>
                </Col>
              </Grid>
              <Grid sx={{ margin: '10px 0' }}>
                <Col span={6}>
                  <Text>Total Price</Text>
                </Col>
                <Col span={6}>
                  {initialCartItems ? (
                    <Text align="right">
                      ${' '}
                      {initialCartItems
                        .reduce(
                          (acc: any, item: any) =>
                            acc + item.quantity * item.price,
                          0
                        )
                        .toFixed(2)}
                    </Text>
                  ) : (
                    <Text align="right">${'0'}</Text>
                  )}
                </Col>
              </Grid>
            </Card>
          </Col>
          <Col span={12}>
            <Button
              onClick={() => handlerOrderCreate()}
              loading={createOrderLoading}
              color="dark"
              radius="lg"
              fullWidth
            >
              Place Order
            </Button>
          </Col>
        </Grid>
      </Card>
    </Layout>
  )
}

export default PlaceOrder
