import { Grid, Text, Col, Divider } from '@mantine/core'
import { PropsWithChildren } from 'react'
import moment from 'moment'
import React from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'

interface IReviewCard {
  id: string
  username: string
  date: Date
  comment: string
  rating: number
}

const renderRatingsList = (rating: number) => {
  const stars = []

  for (let i = 1; i <= rating; i++) {
    stars.push(<AiFillStar color="orange" />)
  }

  let remainingStars = 5 - stars.length

  for (let i = 1; i <= remainingStars; i++) {
    stars.push(<AiOutlineStar />)
  }

  return <div>{stars}</div>
}

const ReviewCard: React.FC<PropsWithChildren<IReviewCard>> = ({
  id,
  username,
  date,
  comment,
  rating
}) => {
  return (
    <>
      <Grid>
        <Col
          xs={12}
          sm={3}
          md={2}
          lg={2}
          xl={2}
          sx={{ display: 'flex', alignItems: 'center' }}
          span={2}
        >
          <Col span={12}>
            <Text sx={{ marginBottom: '5px' }} weight={600}>
              {username}
            </Text>
            <Text
              color="gray"
              sx={{ marginBottom: '5px' }}
              size="xs"
              weight={600}
            >
              {moment(date).format('DD-MMM-YYYY')}
            </Text>
            {renderRatingsList(rating)}
          </Col>
        </Col>
        <Col
          xs={12}
          sm={9}
          md={10}
          lg={10}
          xl={10}
          sx={{ display: 'flex', alignItems: 'center' }}
          span={10}
        >
          <Text weight={600}>"{comment}"</Text>
        </Col>
      </Grid>
      <Divider />
    </>
  )
}

export default ReviewCard
