import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.deleteMany()

  await prisma.user.create({
    data: {
      username: 'Hai Duong',
      email: 'dohaiduong@gmail.com',
      verified: true,
      password:
        '0xc888c9ce9e098d5864d3ded6ebcc140a12142263bace3a23a36f9905f12bd64a',
      verification_code: faker.string.alphanumeric(6),
      avatar_url: faker.image.avatarLegacy(),
      role: 0,
      phone: faker.phone.number(),
      two_factor_auth: false,
      two_factor_secret: faker.string.alphanumeric(64),
      refresh_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRvaGFpZHVvbmdAZ21haWwuY29tIiwicm9sZSI6MCwicGhvbmUiOiIwMTIzNDU2Nzg5IiwiaWF0IjoxNzA5MTEyNDY3LCJleHAiOjE3MDk3MTcyNjd9.6XOsho37RCTYvrwjSVcB5tqiPaYyIIQA_Z2dnKqzQZk',
      google_id: '',
      last_login_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }
  })

  console.log('Data seeded successfully')
}

main()
  .catch(e => {
    console.error(e)
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect()
  })
