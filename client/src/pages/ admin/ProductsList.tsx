/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Card,
  Table,
  Image,
  Button,
  Pagination,
  Group,
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Text,
  Select,
  Grid,
  Col
} from '@mantine/core'
import Head from '../../components/Head'
import Layout from '../../layout/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actionCreators, asyncAction, State } from '../../state'
import { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import { BiDetail, BiTrashAlt } from 'react-icons/bi'
import { useForm } from '@mantine/hooks'
import axios from 'axios'
import React from 'react'
import { SERVER } from '../../constants/constant'
import { useNotifications } from '@mantine/notifications'

const ProductsList = () => {
  const dispatch = useDispatch()
  const notifications = useNotifications()

  const [activePage, setActivePage] = useState(1)
  const [opened, setOpened] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openRemove, setOpenRemove] = useState(false)
  const [selectedItem, setSelectedItem] = useState('')
  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [initialProductsItems, setInitialProductsItems] = useState([])
  const [selectedImage, setSelectedImage] = useState('')
  const [Success, setSuccess] = useState(false)

  const { getProducts, createProduct, updateProduct, removeProduct } =
    bindActionCreators(actionCreators, dispatch)

  const { products, error, loading } = useSelector(
    (state: State) => state.products
  )

  const {
    productCreate,
    error: createProductError,
    loading: createProductLoading
  } = useSelector((state: State) => state.createProduct)

  const form = useForm({
    initialValues: {
      name: selectedItem,
      image: '',
      brand: '',
      description: '',
      category: '',
      price: 10,
      count: 100
    },
    validationRules: {
      name: value => value.trim().length > 2,
      // image: (value) => value.trim().length > 2,
      brand: value => value.trim().length > 2,
      description: value => value.trim().length > 2,
      category: value => value.trim().length > 2,
      price: value => value > 0,
      count: value => value > 0
    },
    errorMessages: {
      name: 'Provide a valid name',
      image: 'Provide a valid image',
      brand: 'Provide a valid brand',
      description: 'Provide a valid description',
      category: 'Provide a valid category',
      price: 'Provide a valid price',
      count: 'Provide a valid count'
    }
  })

  const handlerSetDetails = (product: any) => {
    form.setValues({
      name: product.name,
      image: product.image,
      brand: product.brand,
      description: product.description,
      category: product.category,
      price: product.price,
      count: product.countInStock
    })
    setSelectedItem(product)
    setSelectedImage(product.image)
    setOpenUpdate(true)
  }

  const selectItem = (id: string) => {
    setOpenRemove(true)
    setSelectedItem(id)
  }

  const handlerDeleteItem = (product_id: any) => {
    setOpenRemove(false)
    dispatch(asyncAction(removeProduct(product_id)))
    const updated = initialProductsItems.filter(
      (item: any) => item.product_id !== product_id
    )
    setInitialProductsItems(updated)
    setSuccess(true)
  }
  const uploadFileHandler = async (e: any) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      }
      const { data } = await axios.post(
        `${SERVER.baseURL}/product/upload`,
        formData,
        config
      )
      setImage(data.data)
      setUploading(false)

      form.setValues(currentValues => ({
        ...currentValues,
        image: data.data
      }))
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  const handlerPageChange = (page: number) => {
    setActivePage(page)
    getProducts(page)
  }
  const handlerOpenForm = () => {
    setOpened(true)
    form.reset()
  }

  const handlerAddProduct = (values: any) => {
    const { name, image, brand, description, category, price, countInStock } =
      values

    dispatch(
      asyncAction(
        createProduct(
          name,
          image,
          brand,
          category,
          description,
          price,
          countInStock
        )
      )
    )
    setOpened(false)
    setSuccess(true)
  }

  const handlerUpdateProduct = (values: any) => {
    const jsonData = JSON.stringify(selectedItem)
    const product_id = JSON.parse(jsonData)._id
    const { name, image, brand, description, category, price, count } = values
    updateProduct(
      product_id,
      name,
      image,
      brand,
      category,
      description,
      price,
      count
    )
    setOpenUpdate(false)
    setSuccess(true)
  }

  useEffect(() => {
    if (Success) {
      notifications.showNotification({
        title: 'Success!',
        message: 'Success',
        color: 'green'
      })
    }
  }, [Success])

  useEffect(() => {
    setActivePage(1)
    dispatch(asyncAction(getProducts(1)))
  }, [dispatch])

  return (
    <Layout>
      <Head title="Products List | Admin" />
      <Modal
        title="Delete Item?"
        radius="lg"
        onClose={() => setOpenRemove(false)}
        opened={openRemove}
      >
        <Text weight={600} size="sm">
          Are you sure that you want to remove this item?
        </Text>
        <Grid sx={{ marginTop: '1rem' }}>
          <Col span={6}>
            {' '}
            <Button
              onClick={() => setOpenRemove(false)}
              color="gray"
              radius="lg"
              fullWidth
            >
              Cancel
            </Button>
          </Col>
          <Col span={6}>
            <Button
              onClick={() => handlerDeleteItem(selectedItem)}
              color="red"
              radius="lg"
              fullWidth
            >
              Yes
            </Button>
          </Col>
        </Grid>
      </Modal>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Product Details"
        radius="lg"
      >
        <form onSubmit={form.onSubmit(values => handlerAddProduct(values))}>
          <Group direction="column" grow>
            <TextInput
              label="Product Name"
              placeholder="Product Name"
              {...form.getInputProps('name')}
              radius="lg"
              error={form.errors.name}
            />
            <TextInput
              label="Product Brand"
              placeholder="Product Brand"
              {...form.getInputProps('brand')}
              radius="lg"
              error={form.errors.brand}
            />
            <Textarea
              label="Product Description"
              placeholder="Product Description"
              {...form.getInputProps('description')}
              radius="lg"
              error={form.errors.description}
            />
            <Select
              data={[
                { value: 'Laptops', label: 'Laptops' },
                { value: 'Desktops', label: 'Desktops' },
                { value: 'Phones', label: 'Phones' },
                { value: 'Accessories', label: 'Accessories' }
              ]}
              radius="lg"
              label="Product Category"
              placeholder="Product Category"
              {...form.getInputProps('category')}
              error={form.errors.category}
            />
            <NumberInput
              label="Product Count"
              placeholder="Product Count"
              {...form.getInputProps('count')}
              radius="lg"
              error={form.errors.count}
            />
            {image && <Text>{image}</Text>}

            {uploading ? (
              <Loading />
            ) : (
              <input
                type="file"
                id="myfile"
                name="myfile"
                onChange={uploadFileHandler}
              />
            )}

            <NumberInput
              label="Product Price"
              placeholder="Product Price"
              {...form.getInputProps('price')}
              error={form.errors.price}
              radius="lg"
            />
            <Button type="submit" color="dark" radius="lg">
              Add Product
            </Button>
          </Group>
        </form>
      </Modal>
      <Modal
        opened={openUpdate}
        onClose={() => setOpenUpdate(false)}
        title="Product Details"
        radius="lg"
      >
        <form onSubmit={form.onSubmit(values => handlerUpdateProduct(values))}>
          <Group direction="column" grow>
            <TextInput
              label="Product Name"
              placeholder="Product Name"
              {...form.getInputProps('name')}
              radius="lg"
              error={form.errors.name}
            />
            <TextInput
              label="Product Brand"
              placeholder="Product Brand"
              {...form.getInputProps('brand')}
              radius="lg"
              error={form.errors.brand}
            />
            <Textarea
              label="Product Description"
              placeholder="Product Description"
              {...form.getInputProps('description')}
              radius="lg"
              error={form.errors.description}
            />
            <Select
              data={[
                { value: 'Laptops', label: 'Laptops' },
                { value: 'Desktops', label: 'Desktops' },
                { value: 'Phones', label: 'Phones' },
                { value: 'Accessories', label: 'Accessories' }
              ]}
              radius="lg"
              label="Product Category"
              placeholder="Product Category"
              {...form.getInputProps('category')}
              error={form.errors.category}
            />
            <NumberInput
              label="Product Count"
              placeholder="Product Count"
              {...form.getInputProps('count')}
              radius="lg"
              error={form.errors.count}
            />

            {uploading ? (
              <Loading />
            ) : (
              <input
                type="file"
                id="myfile"
                name="myfile"
                onChange={uploadFileHandler}
              />
            )}
            {selectedImage && <Text>{selectedImage}</Text>}

            <NumberInput
              label="Product Price"
              placeholder="Product Price"
              {...form.getInputProps('price')}
              error={form.errors.price}
              radius="lg"
            />
            <Button type="submit" color="dark" radius="lg">
              Update Product
            </Button>
          </Group>
        </form>
      </Modal>
      <Card shadow="md" radius="lg">
        <Group sx={{ marginBottom: '1rem' }} direction="row" position="apart">
          <Text weight={700}>Products</Text>
          <Button radius="lg" color="dark" onClick={() => handlerOpenForm()}>
            Add New Product
          </Button>
        </Group>
        {loading ? (
          <Loading />
        ) : (
          <Group position="center" direction="column">
            <Table horizontalSpacing="xl" verticalSpacing="xs" highlightOnHover>
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Category</th>
                  <th>Count In Stock</th>
                  <th>Price</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products && products.data
                  ? products.data.map((product: any) => (
                      <tr key={product._id}>
                        <td>{product.brand}</td>
                        <td>{product.name}</td>
                        <td>{product.description.substring(0, 50) + '...'}</td>
                        <td>
                          <Image
                            fit="contain"
                            height={50}
                            width={60}
                            src={product.image}
                            alt={`Image of ${product.name}`}
                          />
                        </td>
                        <td>{product.category}</td>
                        <td>{product.countInStock}</td>
                        <td>${product.price}</td>
                        <td>
                          <Button
                            color="dark"
                            radius="xl"
                            onClick={() => handlerSetDetails(product)}
                          >
                            <BiDetail />
                          </Button>
                        </td>
                        <td>
                          <Button
                            color="red"
                            radius="xl"
                            onClick={() => selectItem(product._id)}
                          >
                            <BiTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </Table>
            <Pagination
              total={Math.round(products.total / products.count)}
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

export default ProductsList
