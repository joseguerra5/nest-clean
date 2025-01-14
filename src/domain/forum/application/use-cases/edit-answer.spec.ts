import { makeAnswer } from 'test/factories/make-answer'
import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'

let inMemoryAnswerRepository: InMemoryAnswerRepository
let sut: EditAnswerUseCase

describe('Edit a answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    sut = new EditAnswerUseCase(inMemoryAnswerRepository)
  })
  it('should be able to edit a answer', async () => {

    const newAnswer = makeAnswer({
      authorId: new UniqueEntityId("author-01"),
      questionId: new UniqueEntityId("answer-01"),
    }, new UniqueEntityId("answer-01"))

    await inMemoryAnswerRepository.create(newAnswer)

    await sut.execute({
      answerId: "answer-01",
      authorId: "author-01",
      content: "example-01",
    })


    expect(inMemoryAnswerRepository.items).toHaveLength(1)
    expect(inMemoryAnswerRepository.items[0]).toMatchObject({     
      content: "example-01",
    })
  })

  it('not should be able to edit a answer with diferent authorId', async () => {

    const newAnswer = makeAnswer({
      authorId: new UniqueEntityId("author-01")
    }, new UniqueEntityId("answer-01"))

    await inMemoryAnswerRepository.create(newAnswer)

    const result = await sut.execute({
        answerId: "answer-01",
        authorId: "author-02",
        content: "example-01",
      })
    expect(result.value).toBeInstanceOf(Error)
  
  })
})
