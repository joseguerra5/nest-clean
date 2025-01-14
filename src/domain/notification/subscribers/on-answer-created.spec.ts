import { makeAnswer } from "test/factories/make-answer"
import { OnAnswerCreated } from "./on-answer-created"
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository"
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository"
import { InMemoryQuestionRepository } from "test/repositories/in-memory-questions-repository"
import { SendNotificationUseCase } from "../application/use-cases/send-notification"
import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository"
import { makeQuestion } from "test/factories/make-question"
import { waitFor } from "test/util/wait-for"
import { vi, MockInstance } from "vitest"

let inMemoryQuestionAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryNotificationRepository: InMemoryNotificationRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance
describe("On Answer Created", () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository()
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository()
    inMemoryQuestionAttachmentRepository = new InMemoryAnswerAttachmentRepository()
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationRepository)

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute")
    new OnAnswerCreated(
      inMemoryQuestionRepository,
      sendNotificationUseCase
    )
  })
  it("should be able to send a notification when an answer is created", async () => {
    const question = makeQuestion()

    const answer = makeAnswer({
      questionId: question.id
    })

    inMemoryQuestionRepository.create(question)
    inMemoryAnswerRepository.create(answer)


    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })



  })
})