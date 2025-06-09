/* eslint-disable react-hooks/exhaustive-deps */
import React, { PropsWithChildren, useEffect, useState } from 'react';
import {
  Container,
  useMantineTheme,
  Header as Head,
  MediaQuery,
  Burger,
  ActionIcon,
  Button,
  Grid,
  Col,
  Text,
  Badge,
  Select
} from '@mantine/core';
import Footer from '../components/Footer';
import { AiOutlineUsb } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { BiShoppingBag, BiUser } from 'react-icons/bi';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators, asyncAction, State } from '../state';
import { FiSearch } from 'react-icons/fi';

interface LayoutProps {
  children: any;
}

const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({ children }) => {
  const [value, setValue] = useState('');
  const [searchData, setSearchData] = useState<{ value: string; label: string }[]>([]);
  const { userInfo } = useSelector((state: State) => state.userLogin);
  const { cartItem } = useSelector((state: State) => state.cart);
  const { quickSearch } = useSelector((state: State) => state.quickSearch);
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { quickSearchProducts } = bindActionCreators(actionCreators, dispatch);
  const [initialCartItems, setInitialCartItems] = useState(cartItem.cart || []);

  const handlerNavigate = (route: string) => {
    navigate(route);
    setOpened(false);
  };

  const handlerSearch = (keyword: string) => {
    setValue(keyword);
    if (keyword.trim()) {
      quickSearchProducts(keyword);
    } else {
      setSearchData([]);
    }
  };

  const handlerSearchSelect = (id: string | null) => {
    if (id) {
      navigate(`/product/${id}`);
      setValue('');
      setSearchData([]);
    }
  };

  useEffect(() => {
    // dispatch(asyncAction(getCart()));
    if (quickSearch && quickSearch.data) {
      setSearchData(
        quickSearch.data.map((item: any) => ({
          value: item.id,
          label: item.name
        }))
      );
    }
  }, [quickSearch, cartItem.item]);

  useEffect(() => {
    if (cartItem.items) {
      setInitialCartItems(cartItem.items);
    }
  }, [cartItem.items]);

  const openMobileNavbar = () => {
    if (opened) {
      return (
        <div className="mobile-header">
          <Grid>
            <Col
              onClick={() => handlerNavigate('/')}
              className="flex-container"
              sx={{ marginTop: '2rem' }}
              span={12}
            >
              <AiOutlineUsb />
              <Text weight={500} size="xl" align="center">
                Techstop
              </Text>
            </Col>
            <Col
              onClick={() => handlerNavigate('/')}
              sx={{ marginTop: '1rem' }}
              span={12}
            >
              <Text color="gray" weight={500} size="xl" align="center">
                Home
              </Text>
            </Col>
            <Col
              onClick={() => handlerNavigate('/shop')}
              sx={{ marginTop: '1rem' }}
              span={12}
            >
              <Text color="gray" weight={500} size="xl" align="center">
                Shop
              </Text>
            </Col>
            <Col
              onClick={() => handlerNavigate('/cart')}
              sx={{ marginTop: '1rem' }}
              span={12}
            >
              <Text color="gray" weight={500} size="xl" align="center">
                Cart
              </Text>
            </Col>
            <Col sx={{ marginTop: '1rem' }} span={12}>
              <Text
                onClick={() => handlerNavigate('/profile')}
                weight={500}
                size="xl"
                align="center"
                color="gray"
              >
                Profile
              </Text>
            </Col>
            <Col
              onClick={() => handlerNavigate('/login')}
              sx={{ marginTop: '1rem' }}
              span={12}
            >
              {!userInfo && (
                <Text color="gray" weight={500} size="xl" align="center">
                  Log In
                </Text>
              )}
            </Col>
          </Grid>
        </div>
      );
    } else {
      return (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              minHeight: '90vh'
            }}
          >
            <Container
              sx={{
                marginTop: '7rem',
                maxWidth: '1620px',
                width: '100%'
              }}
            >
              {children}
            </Container>
          </div>
          <Footer />
        </>
      );
    }
  };

  return (
    <>
      <Head height={70} padding="md" fixed>
        <div className="flex-container-horizontal-align-space-between height-full-perc">
          <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
            <Burger
              opened={opened}
              onClick={() => setOpened(o => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>
          <div className="flex-container-no-horizontal-align">
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
              <AiOutlineUsb />
            </MediaQuery>
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
              <Link className="header-home" to="/">
                Techstop
              </Link>
            </MediaQuery>
          </div>
          <div className="flex-container-no-horizontal-align">
            <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
              <Select
                placeholder="Search for an item..."
                size="md"
                nothingFound="No products found"
                icon={<FiSearch />}
                onSearchChange={handlerSearch}
                onChange={handlerSearchSelect}
                radius="lg"
                data={searchData}
                searchable
                style={{ minWidth: '300px' }}
              />
            </MediaQuery>
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
              <Button
                radius="lg"
                sx={{ margin: '10px', backgroundColor: '#333' }}
                leftIcon={<BiShoppingBag />}
                onClick={() => navigate('/cart')}
              >
                {userInfo && initialCartItems ? (
                  <Badge variant="filled" color="red">
                    {initialCartItems.reduce(
                      (acc: any, item: any) => acc + item.quantity,
                      0
                    )}
                  </Badge>
                ) : (
                  <Badge variant="filled" color="red">
                    0
                  </Badge>
                )}
              </Button>
            </MediaQuery>
            {userInfo && (
              <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                <ActionIcon
                  size="lg"
                  onClick={() => navigate('/profile')}
                  sx={{ margin: '10px' }}
                  variant="default"
                  radius="lg"
                >
                  <BiUser />
                </ActionIcon>
              </MediaQuery>
            )}
            {!userInfo && (
              <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                <Button
                  onClick={() => navigate('/login')}
                  color="dark"
                  variant="filled"
                  sx={{ margin: '10px' }}
                  radius="lg"
                  size="sm"
                >
                  Log In
                </Button>
              </MediaQuery>
            )}
          </div>
        </div>
      </Head>
      {openMobileNavbar()}
    </>
  )
}

export default Layout
