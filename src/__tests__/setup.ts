import '@testing-library/jest-dom'

// Mock fetch for all tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
  })
) as jest.Mock

beforeEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

afterEach(() => {
  jest.clearAllMocks()
})