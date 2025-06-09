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
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [initialProductsItems, setInitialProductsItems] = useState([])
  const [selectedImage, setSelectedImage] = useState('')
  const [success, setSuccess] = useState(false)

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
      name: '',
      image: '',
      brand: '',
      description: '',
      category: '',
      price: 10,
      count_in_stock: 100
    },
    validationRules: {
      name: value => value.trim().length > 2,
      brand: value => value.trim().length > 2,
      description: value => value.trim().length > 2,
      category: value => value.trim().length > 2,
      price: value => value > 0,
      count_in_stock: value => value > 0
    },
    errorMessages: {
      name: 'Name must be at least 3 characters',
      brand: 'Brand must be at least 3 characters',
      description: 'Description must be at least 3 characters',
      category: 'Category must be at least 3 characters',
      price: 'Price must be greater than 0',
      count_in_stock: 'Count must be greater than 0'
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
      count_in_stock: product.count_in_stock
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
    if (!file) return

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
      setImage(data.data.data) // Lấy đúng URL từ response
      form.setValues(currentValues => ({
        ...currentValues,
        image: data.data.data
      }))
      setUploading(false)
    } catch (error) {
      console.error(error)
      notifications.showNotification({
        title: 'Upload Error',
        message: 'Failed to upload image',
        color: 'red'
      })
      setUploading(false)
    }
  }

  const handlerPageChange = (page: number) => {
    setActivePage(page)
    dispatch(asyncAction(getProducts(page)))
  }

  const handlerOpenForm = () => {
    setOpened(true)
    form.reset()
    setImage('')
  }

  const handlerAddProduct = (values: any) => {
    const { name, image, brand, description, category, price, count_in_stock } = values
    dispatch(
      asyncAction(
        createProduct(name, image, brand, category, description, price, count_in_stock)
      )
    )
    setOpened(false)
    setSuccess(true)
  }

  const handlerUpdateProduct = (values: any) => {
    if (!selectedItem) return
    const product_id = selectedItem.id
    const { name, image, brand, description, category, price, count_in_stock } = values
    dispatch(
      asyncAction(
        updateProduct(
          product_id,
          name,
          image,
          brand,
          category,
          description,
          price,
          count_in_stock
        )
      )
    )
    setOpenUpdate(false)
    setSuccess(true)
  }

  useEffect(() => {
    if (success) {
      notifications.showNotification({
        title: 'Success!',
        message: 'Operation completed successfully',
        color: 'green'
      })
      setSuccess(false)
    }
    if (error || createProductError) {
      notifications.showNotification({
        title: 'Error',
        message: error || createProductError,
        color: 'red'
      })
    }
  }, [success, error, createProductError])

  useEffect(() => {
    dispatch(asyncAction(getProducts(1)))
  }, [dispatch])

  useEffect(() => {
    if (products && products.data) {
      setInitialProductsItems(products.data)
    }
  }, [products])

  return (
    <Layout>
      <Head title="Products List | Admin" />
      <Modal
        title="Delete Item?"
        radius="lg"
        onClose={() => setOpenRemove(false)}
        opened={openRemove}>
        <Text weight={600} size="sm">
          Are you sure you want to remove this item?
        </Text>
        <Grid sx={{ marginTop: '1rem' }}>
          <Col span={6}>
            <Button
              onClick={() => setOpenRemove(false)}
              color="gray"
              radius="lg"
              fullWidth>
              Cancel
            </Button>
          </Col>
          <Col span={6}>
            <Button
              onClick={() => handlerDeleteItem(selectedItem)}
              color="red"
              radius="lg"
              fullWidth>
              Yes
            </Button>
          </Col>
        </Grid>
      </Modal>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add Product"
        radius="lg">
        <form onSubmit={form.onSubmit(handlerAddProduct)}>
          <Group direction="column" grow>
            <TextInput
              label="Product Name"
              placeholder="Enter product name"
              {...form.getInputProps('name')}
              radius="lg"
            />
            <TextInput
              label="Product Brand"
              placeholder="Enter brand"
              {...form.getInputProps('brand')}
              radius="lg"
            />
            <Textarea
              label="Product Description"
              placeholder="Enter description"
              {...form.getInputProps('description')}
              radius="lg"
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
              placeholder="Select category"
              {...form.getInputProps('category')}
            />
            <NumberInput
              label="Product Count"
              placeholder="Enter stock count"
              {...form.getInputProps('count_in_stock')}
              radius="lg"
            />
            <TextInput
              label="Product Image"
              placeholder="Upload image"
              value={image}
              readOnly
              radius="lg"
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
            <NumberInput
              label="Product Price"
              placeholder="Enter price"
              {...form.getInputProps('price')}
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
        title="Update Product"
        radius="lg">
        <form onSubmit={form.onSubmit(handlerUpdateProduct)}>
          <Group direction="column" grow>
            <TextInput
              label="Product Name"
              placeholder="Enter product name"
              {...form.getInputProps('name')}
              radius="lg"
            />
            <TextInput
              label="Product Brand"
              placeholder="Enter brand"
              {...form.getInputProps('brand')}
              radius="lg"
            />
            <Textarea
              label="Product Description"
              placeholder="Enter description"
              {...form.getInputProps('description')}
              radius="lg"
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
              placeholder="Select category"
              {...form.getInputProps('category')}
            />
            <NumberInput
              label="Product Count"
              placeholder="Enter stock count"
              {...form.getInputProps('count_in_stock')}
              radius="lg"
            />
            <TextInput
              label="Product Image"
              placeholder="Upload image"
              value={image || selectedImage}
              readOnly
              radius="lg"
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
            <NumberInput
              label="Product Price"
              placeholder="Enter price"
              {...form.getInputProps('price')}
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
          <Button radius="lg" color="dark" onClick={handlerOpenForm}>
            Add New Product
          </Button>
        </Group>
        {loading || createProductLoading ? (
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
                      <tr key={product.id}>
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
                        <td>{product.count_in_stock}</td>
                        <td>${product.price}</td>
                        <td>
                          <Button
                            color="dark"
                            radius="xl"
                            onClick={() => handlerSetDetails(product)}>
                            <BiDetail />
                          </Button>
                        </td>
                        <td>
                          <Button
                            color="red"
                            radius="xl"
                            onClick={() => selectItem(product.id)}>
                            <BiTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </Table>
            <Pagination
              total={
                products && products.total
                  ? Math.ceil(products.total / 8)
                  : 1
              }
              page={activePage}
              color="dark"
              radius="xl"
              onChange={handlerPageChange}
            />
          </Group>
        )}
      </Card>
    </Layout>
  )
}

export default ProductsList
