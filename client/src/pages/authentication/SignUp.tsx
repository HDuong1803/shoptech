/* eslint-disable react-hooks/exhaustive-deps */
import {
  Container,
  Card,
  Grid,
  TextInput,
  Col,
  Text,
  PasswordInput,
  Button
} from '@mantine/core'
import { useForm } from '@mantine/hooks'
import { useNotifications } from '@mantine/notifications'
import { AiOutlineUsb } from 'react-icons/ai'
import { useNavigate } from 'react-router'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import { actionCreators, asyncAction } from '../../state'
import { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import Head from '../../components/Head'
import React from 'react'

const SignUp = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const notifications = useNotifications()
  const { register } = bindActionCreators(actionCreators, dispatch)

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    },
    validationRules: {
      username: value => value.trim().length > 1,
      email: value => /^\S+@\S+$/.test(value),
      phone: value => value.trim().length === 10,
      password: value => value.trim().length >= 6,
      confirmPassword: (confirmPassword, values) =>
        confirmPassword === values?.password
    },
    errorMessages: {
      username: 'Name should be more than 2 characters or longer',
      email: 'Email is not valid',
      phone: 'Phone number is not valid',
      password: 'Password should be 6 characters or longer',
      confirmPassword: 'Passwords does not match'
    }
  })

  const { userInfo, loading, error } = useSelector(
    (state: RootStateOrAny) => state.userRegister
  )

  const handlerRegister = (values: any) => {
    const { username, email, password, phone } = values
    dispatch(asyncAction(register(username, email, phone, password)))
  }

  useEffect(() => {
    if (error) {
      notifications.showNotification({
        title: 'Oh no!',
        message: 'Email is already exist',
        color: 'red'
      })
    }
  }, [error])

  useEffect(() => {
    if (userInfo) {
      navigate('/')
    }
  }, [userInfo])

  return (
    <Container className="flex-container height-full-vh">
      <Head title="Sign Up | Techstop" description="Shop for gadgets" />
      <Card
        withBorder
        padding="xl"
        radius="lg"
        shadow="xl"
        sx={{ width: '500px' }}
      >
        <form onSubmit={form.onSubmit(values => handlerRegister(values))}>
          <Grid>
            <Col className="flex-container" span={12}>
              <AiOutlineUsb />
              <Text align="center" weight={700} size="xl">
                Techstop
              </Text>
            </Col>
            <Col span={12}>
              <TextInput
                radius="lg"
                placeholder="Your name"
                label="Username"
                {...form.getInputProps('username')}
                error={form.errors.username}
                required
              />
            </Col>
            <Col span={12}>
              <TextInput
                radius="lg"
                placeholder="Your email"
                label="Email"
                {...form.getInputProps('email')}
                error={form.errors.email}
                required
              />
            </Col>
            <Col span={12}>
              <TextInput
                radius="lg"
                placeholder="Your phone number"
                label="Phone"
                {...form.getInputProps('phone')}
                error={form.errors.phone}
                required
              />
            </Col>
            <Col span={12}>
              <PasswordInput
                radius="lg"
                placeholder="Your password"
                label="Password"
                {...form.getInputProps('password')}
                error={form.errors.password}
                required
              />
            </Col>
            <Col span={12}>
              <PasswordInput
                radius="lg"
                placeholder="Confirm password"
                label="Confirmation"
                {...form.getInputProps('confirmPassword')}
                error={form.errors.confirmPassword}
                required
              />
            </Col>
            <Col sx={{ marginTop: '10px' }} span={12}>
              <Button
                loading={loading}
                type="submit"
                fullWidth
                color="dark"
                radius="lg"
              >
                Sign Up
              </Button>
            </Col>
            <Col span={12}>
              <Button
                onClick={() => navigate('/login')}
                color="black"
                fullWidth
                variant="white"
              >
                Already have an account? Log in
              </Button>
            </Col>
          </Grid>
        </form>
      </Card>
    </Container>
  )
}

export default SignUp
