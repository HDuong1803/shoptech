/* eslint-disable react-hooks/exhaustive-deps */
import {
  Alert,
  Button,
  Card,
  Col,
  Grid,
  Group,
  Image,
  Modal,
  NumberInput,
  NumberInputHandlers,
  Text
} from '@mantine/core'
import { RiShoppingBagLine } from 'react-icons/ri'
import Layout from '../layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { bindActionCreators } from 'redux'
import { actionCreators, asyncAction, State } from '../state'
import { useNavigate } from 'react-router'
import { BiTrashAlt } from 'react-icons/bi'
import React from 'react'

type Quantities = {
  [key: string]: number
}

const Cart = () => {
  const numRef = useRef<NumberInputHandlers>(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [opened, setOpened] = useState(false)
  const [selectedItem, setSelectedItem] = useState('')
  const [initialCartItems, setInitialCartItems] = useState([])
  const [quantity, setQuantity] = useState<Quantities>({})
  const { cartItem } = useSelector((state: State) => state.cart)

  const { getCart, updateCart, removeFromCart } = bindActionCreators(
    actionCreators,
    dispatch
  )

  const handlerUpdateCartItems = (product_id: string, action: string) => {
    dispatch(asyncAction(updateCart(product_id, action)))
  }

  const handlerQuantityChange = (
    product_id: string,
    quantity: number,
    newQuantity: number
  ) => {
    let action: string
    if (quantity > 0) {
      action = 'increment'
    } else {
      action = 'decrement'
    }
    if (newQuantity < 1) return
    handlerUpdateCartItems(product_id, action)
    setQuantity(prevQuantities => ({
      ...prevQuantities,
      [product_id]: newQuantity
    }))
  }

  const selectItem = (id: string) => {
    setOpened(true)
    setSelectedItem(id)
  }

  const handlerDeleteCartItem = async (id: string) => {
    setOpened(false)
    dispatch(asyncAction(removeFromCart(id)))
    const updated = initialCartItems.filter(
      (item: any) => item.product_id !== id
    )
    setInitialCartItems(updated)
  }

  useEffect(() => {
    if (cartItem.cart) {
      setInitialCartItems(cartItem.cart)
    }
  }, [cartItem.cart])

  useEffect(() => {
    dispatch(asyncAction(getCart()))
  }, [])

  return (
    <Layout>
      <Modal
        title="Delete Item?"
        radius="lg"
        onClose={() => setOpened(false)}
        opened={opened}
      >
        <Text weight={600} size="sm">
          Are you sure that you want to remove this item?
        </Text>
        <Grid sx={{ marginTop: '1rem' }}>
          <Col span={6}>
            {' '}
            <Button
              onClick={() => setOpened(false)}
              color="gray"
              radius="lg"
              fullWidth
            >
              Cancel
            </Button>
          </Col>
          <Col span={6}>
            <Button
              onClick={() => handlerDeleteCartItem(selectedItem)}
              color="red"
              radius="lg"
              fullWidth
            >
              Yes
            </Button>
          </Col>
        </Grid>
      </Modal>
      <Grid>
        <Col xs={12} sm={12} md={9} lg={9} xl={9} span={9}>
          {initialCartItems && initialCartItems.length ? (
            initialCartItems.map((item: any) => {
              return (
                <Card
                  sx={{ marginTop: '1rem' }}
                  radius="lg"
                  shadow="xl"
                  withBorder
                >
                  <Grid>
                    <Col xs={12} sm={2} md={2} lg={2} xl={2} span={2}>
                      <Image
                        fit="contain"
                        radius="lg"
                        height={100}
                        width={100}
                        src={item.image}
                      />
                    </Col>
                    <Col
                      sx={{ display: 'flex', alignItems: 'center' }}
                      xs={12}
                      sm={5}
                      md={5}
                      lg={5}
                      xl={5}
                      span={5}
                    >
                      <Text color="gray" weight={600}>
                        {item.name}
                      </Text>
                    </Col>
                    <Col
                      sx={{ display: 'flex', alignItems: 'center' }}
                      xs={5}
                      sm={5}
                      md={5}
                      lg={2}
                      xl={2}
                      span={2}
                    >
                      <Text color="gray" weight={600}>
                        ${item.price} x{' '}
                        {quantity[item.product_id] || item.quantity}
                      </Text>
                    </Col>
                    <Col
                      xs={6}
                      sm={6}
                      md={6}
                      lg={2}
                      xl={2}
                      span={2}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Group mt="md" mb="md">
                        <Button
                          size="sm"
                          radius="xl"
                          onClick={() =>
                            handlerQuantityChange(
                              item.product_id,
                              -1,
                              (quantity[item.product_id] || item.quantity) - 1
                            )
                          }
                        >
                          -
                        </Button>
                        <NumberInput
                          radius="xl"
                          size="md"
                          text-align="center"
                          value={quantity[item.product_id] || item.quantity}
                          handlersRef={numRef}
                          step={1}
                          min={1}
                          required
                          hideControls
                          style={{ width: '45px' }}
                        />
                        <Button
                          size="sm"
                          radius="xl"
                          onClick={() =>
                            handlerQuantityChange(
                              item.product_id,
                              1,
                              (quantity[item.product_id] || item.quantity) + 1
                            )
                          }
                        >
                          +
                        </Button>
                      </Group>
                    </Col>
                    <Col
                      xs={12}
                      sm={6}
                      md={6}
                      lg={1}
                      xl={1}
                      span={1}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Button
                        size="sm"
                        radius="lg"
                        variant="filled"
                        color="red"
                        onClick={() => selectItem(item.product_id)}
                        fullWidth
                      >
                        <BiTrashAlt />
                      </Button>
                    </Col>
                  </Grid>
                </Card>
              )
            })
          ) : (
            <Alert
              icon={<RiShoppingBagLine size={16} />}
              sx={{ marginTop: '1rem' }}
              color="blue"
              radius="lg"
            >
              No items in the cart
            </Alert>
          )}
        </Col>
        <Col
          sx={{ marginTop: '.5rem' }}
          xs={12}
          sm={12}
          md={3}
          lg={3}
          xl={3}
          span={3}
        >
          {initialCartItems && initialCartItems.length ? (
            <Card
              sx={{ marginTop: '.5rem' }}
              radius="lg"
              shadow="xl"
              withBorder
            >
              <Text color="gray" sx={{ marginBottom: '1rem' }} weight={600}>
                Subtotal (
                {initialCartItems.reduce(
                  (acc: number, item: any) =>
                    acc + (quantity[item.product_id] || item.quantity),
                  0
                )}{' '}
                Items)
              </Text>

              <Text size="xl" sx={{ marginTop: '.5rem' }} weight={700}>
                $
                {initialCartItems
                  .reduce(
                    (acc: number, item: any) =>
                      acc +
                      (quantity[item.product_id] || item.quantity) * item.price,
                    0
                  )
                  .toFixed(2)}
              </Text>
              <Button
                sx={{ marginTop: '.5rem' }}
                color="dark"
                radius="lg"
                fullWidth
                onClick={() => navigate('/shipping')}
              >
                Proceed to Checkout
              </Button>
            </Card>
          ) : (
            <></>
          )}
        </Col>
      </Grid>
    </Layout>
  )
}

export default Cart
