/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Grid, Pagination } from '@mantine/core'
import ItemCard from '../components/items/ItemCard'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import Layout from '../layout/Layout'
import { useNotifications } from '@mantine/notifications'
import Head from '../components/Head'

import { bindActionCreators } from 'redux'
import { actionCreators, State } from '../state'
import Loading from '../components/Loading'

const Shop = () => {
  const dispatch = useDispatch()
  const notifications = useNotifications()

  const [activePage, setActivePage] = useState(0)

  const { getProducts } = bindActionCreators(actionCreators, dispatch)
  const { products, error, loading } = useSelector(
    (state: State) => state.products
  )

  const handlerPageChange = (page: number) => {
    setActivePage(page)
    getProducts(page)
  }

  useEffect(() => {
    setActivePage(1)
    getProducts(1)
  }, [dispatch])

  useEffect(() => {
    if (error) {
      notifications.showNotification({
        title: 'Error!',
        message: error,
        color: 'red'
      })
    }
  }, [error, notifications, dispatch])

  return (
    <Layout>
      <Head title="Shop | Techstop" description="Shop for gadgets" />

      {loading ? (
        <Loading />
      ) : (
        <Grid gutter="xl">
          {products && products.data
            ? products.data.map((product: any) => (
                <Col
                  key={product._id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={4}
                  xl={3}
                  span={3}
                >
                  <ItemCard
                    id={product._id}
                    name={product.name}
                    image={product.image}
                    brand={product.brand}
                    category={product.category}
                    description={product.description}
                    rating={product.rating}
                    numReviews={product.numReviews}
                    price={product.price}
                    countInStock={product.countInStock}
                    reviews={product.reviews}
                  />
                </Col>
              ))
            : null}
          <Col className="flex-container" sx={{ margin: '1rem 0' }} span={12}>
            <Pagination
              total={Math.round(products.total / products.count)}
              page={activePage}
              color="dark"
              radius="xl"
              onChange={e => handlerPageChange(e)}
            />
          </Col>
        </Grid>
      )}
    </Layout>
  )
}

export default Shop
