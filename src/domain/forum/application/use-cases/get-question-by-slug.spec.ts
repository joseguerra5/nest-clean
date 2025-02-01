import { InMemoryQuestionRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objecs/slug'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachment-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { makeStudent } from 'test/factories/make-student'
import { makeAttachment } from 'test/factories/make-attachment'
import { makeQuestionAttachment } from 'test/factories/make-question-attachments'

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let attachmentsRepository: InMemoryAttachmentRepository
let studentRepository: InMemoryStudentRepository
let sut: GetQuestionBySlugUseCase

describe('Get question by slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()
    attachmentsRepository = new InMemoryAttachmentRepository()
    studentRepository = new InMemoryStudentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentRepository,
      attachmentsRepository,
      studentRepository,
    )
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository)
  })
  it('should be able get a question by slug', async () => {
    const student = makeStudent({ name: 'Jhon Doe' })
    studentRepository.items.push(student)

    const newQuestion = makeQuestion({
      authorId: student.id,
      slug: Slug.create('example-question'),
    })

    await inMemoryQuestionRepository.create(newQuestion)

    const attachment = makeAttachment({
      title: 'some attachment',
    })

    await attachmentsRepository.create(attachment)

    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      }),
    )

    const result = await sut.execute({
      slug: 'example-question',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        props: expect.objectContaining({
          author: 'Jhon Doe',
          title: newQuestion.title,
          attachments: [
            expect.objectContaining({
              title: attachment.title,
            }),
          ],
        }),
      }),
    })
  })
})
