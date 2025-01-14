import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryQuestionRepository: InMemoryQuestionRepository
let sut: DeleteQuestionUseCase

describe('Delete a question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    sut = new DeleteQuestionUseCase(inMemoryQuestionRepository)
  })
  it('should be able to delete a question', async () => {

    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId("author-01")
    }, new UniqueEntityId("question-01"))

    await inMemoryQuestionRepository.create(newQuestion)

    await sut.execute({
      questionId: "question-01",
      authorId: "author-01"
    })


    expect(inMemoryQuestionRepository.items).toHaveLength(0)
  })

  it('not should be able to delete a question with diferent authorId', async () => {

    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId("author-01")
    }, new UniqueEntityId("question-01"))

    await inMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
        questionId: "question-01",
        authorId: "author-02"
      })
  
      expect(result.value).toBeInstanceOf(Error)
  })
})
