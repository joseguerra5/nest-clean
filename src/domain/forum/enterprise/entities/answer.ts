import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AnswerAttatchmentList } from './answer-attachment-list'
import { AnswerCreatedEvent } from '../events/answer-created-event'

export interface AnswerProps {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
  attachments: AnswerAttatchmentList
  createdAt: Date
  updatedAt?: Date
}
export class Answer extends AggregateRoot<AnswerProps> {
  // evita que outras propriedades acessam a propriedade answer e não são manipuladas diretamente
  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  // mostra resumo com 120 caracteres e concatena com ...
  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set attachments(attachments: AnswerAttatchmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  // metodo privado para atualizar o updatedAt
  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<AnswerProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const answer = new Answer(
      {
        ...props,
        attatchment: props.attachments ?? new AnswerAttatchmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    // porque se não tiver id é porque é uma nova resposta
    const isNewAnswer = !id

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }
    return answer
  }
}
