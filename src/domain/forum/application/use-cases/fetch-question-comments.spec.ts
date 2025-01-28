import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { makeStudent } from 'test/factories/make-student'
import exp from 'constants'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let inMemoryStudenteRepository: InMemoryStudentRepository
let sut: FetchQuestionCommentsUseCase

describe('Get answers by question Id', () => {
  beforeEach(() => {
    inMemoryStudenteRepository = new InMemoryStudentRepository()
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository(inMemoryStudenteRepository)
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository)
  })
  it('should be able to fetch recent answers', async () => {
    const student = makeStudent()

    inMemoryStudenteRepository.items.push(student)

    await inMemoryQuestionCommentRepository.create(makeQuestionComment({ questionId: new UniqueEntityId("question-01"), authorId: student.id }))
    await inMemoryQuestionCommentRepository.create(makeQuestionComment({ questionId: new UniqueEntityId("question-01"), authorId: student.id }))
    await inMemoryQuestionCommentRepository.create(makeQuestionComment({ questionId: new UniqueEntityId("question-01"), authorId: student.id }))

    const result = await sut.execute({
      questionId: "question-01",
      page: 1
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(expect.arrayContaining([
      expect.objectContaining({
        author: student.name
      }),
      expect.objectContaining({
        author: student.name
      }),
      expect.objectContaining({
        author: student.name
      })
    ]))

  })

  it('should be able to fetch paginated recent answers', async () => {
    const student = makeStudent()

    inMemoryStudenteRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentRepository.create(makeQuestionComment({ questionId: new UniqueEntityId("question-01"), authorId: student.id }))
    }

    const result = await sut.execute({
      questionId: "question-01",
      page: 2
    })
    expect(result.value?.comments).toHaveLength(2)
  })
})
