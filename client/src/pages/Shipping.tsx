/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Grid, TextInput, Col, Button } from '@mantine/core'
import { useNavigate } from 'react-router'
import Layout from '../layout/Layout'
import Steps from '../components/Steps'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actionCreators, asyncAction, State } from '../state'
import { useForm } from '@mantine/hooks'
import { bindActionCreators } from 'redux'
import Head from '../components/Head'
import React from 'react'

const Shipping = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { userInfo } = useSelector((state: State) => state.userLogin)

  const { saveShippingAddress } = bindActionCreators(actionCreators, dispatch)

  const form = useForm({
    initialValues: {
      address: '',
      city: '',
      postal_code: '',
      country: ''
    },
    validationRules: {
      address: value => value.trim().length >= 2,
      city: value => value.trim().length >= 2,
      postal_code: value => value.trim().length >= 2,
      country: value => value.trim().length >= 2
    },
    errorMessages: {
      address: 'Address is not valid',
      city: 'City is not valid',
      postal_code: 'Postal Code is not valid',
      country: 'Country is not valid'
    }
  })

  const handlerAddShipping = (values: any) => {
    dispatch(asyncAction(saveShippingAddress(values)))
    navigate('/payment')
  }

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }
  }, [])

  return (
    <Layout>
      <Head title="Shipping" />
      <Card padding="xl" withBorder radius="lg" shadow="xl">
        <Steps active={1} />
        <form onSubmit={form.onSubmit(values => handlerAddShipping(values))}>
          <Grid sx={{ marginTop: '2rem' }}>
            <Col span={12}>
              <TextInput
                radius="lg"
                placeholder="Your Address"
                {...form.getInputProps('address')}
                error={form.errors.address}
                label="Address"
                required
              />
            </Col>
            <Col span={12}>
              <TextInput
                radius="lg"
                placeholder="Your City"
                {...form.getInputProps('city')}
                error={form.errors.city}
                label="City"
                required
              />
            </Col>
            <Col span={12}>
              <TextInput
                radius="lg"
                placeholder="Your Postal Code"
                {...form.getInputProps('postal_code')}
                error={form.errors.postal_code}
                label="Postal Code"
                required
              />
            </Col>
            <Col span={12}>
              <TextInput
                radius="lg"
                placeholder="Your Country"
                {...form.getInputProps('country')}
                error={form.errors.country}
                label="Country"
                required
              />
            </Col>
            <Col span={12}>
              <Button type="submit" radius="lg" color="dark" fullWidth>
                Continue
              </Button>
            </Col>
          </Grid>
        </form>
      </Card>
    </Layout>
  )
}

export default Shipping
