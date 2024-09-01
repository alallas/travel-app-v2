import TestUtils from '@tarojs/test-utils-react'

describe('Testing', () => {

  test('Test', async () => {
    const testUtils = new TestUtils()
    await testUtils.createApp()
    await testUtils.PageLifecycle.onShow('pages/travels.js/travels.js')
    expect(testUtils.html()).toMatchSnapshot()
  })

})
