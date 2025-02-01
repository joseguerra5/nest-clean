import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../application/use-cases/send-notification'
import { DomainEvents } from '@/core/events/domain-events'
import { AnswersRepository } from '@/domain/forum/application/repositories/answer-repository'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/best-answer-chosen'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answerRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  private async sendNewBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answerRepository.findById(bestAnswerId.toString())

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Sua resposta foi escolhida "${question.title.substring(0, 40)}...`,
        content: `A resposta que voce enviou em "${question.title.substring(0, 20)}... foi escolhida pelo autor!`,
      })
    }
  }
}
