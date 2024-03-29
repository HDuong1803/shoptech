import 'dotenv/config'
import { initialAdmin } from '@providers'
import { AdminService } from '@app'
import { Constant } from '@constants'

describe('admin', () => {
  /**
   * Declares variables for an admin service, email and password
   */
  let adminService: AdminService
  let email = ''
  let password = ''

  /**
   * Runs before all tests in the file and initializes the admin user.
   */
  beforeAll(async () => {
    await initialAdmin()
    adminService = new AdminService()
    const { ADMIN_INITIAL_EMAIL, ADMIN_INITIAL_PASSWORD } = Constant
    if (ADMIN_INITIAL_EMAIL && ADMIN_INITIAL_PASSWORD) {
      email = ADMIN_INITIAL_EMAIL
      password = ADMIN_INITIAL_PASSWORD
    }
  }, 10000)

  /**
   * Test to check if the adminService instance is of the correct type.
   */
  it('Check instance type', async () => {
    expect(adminService).toBeInstanceOf(AdminService)
  })

  /**
   * Checks if the admin username and password are defined.
   */
  it('Check admin username and password defined', async () => {
    expect(email).toBeDefined()
    expect(password).toBeDefined()
  })
})
