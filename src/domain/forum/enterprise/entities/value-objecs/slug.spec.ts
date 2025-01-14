import { Slug } from './slug'

test('it should', async () => {
  const slug = Slug.createFromText('Example question title')

  expect(slug.value).toEqual('example-question-title')
})
