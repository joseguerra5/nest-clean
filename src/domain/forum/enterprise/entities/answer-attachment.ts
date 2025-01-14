import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface AnswerAttatchmentProps {
  answerId: UniqueEntityId
  attachmentId: UniqueEntityId
}
export class AnswerAttachment extends Entity<AnswerAttatchmentProps> {
  get answerId() {
    return this.props.answerId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: AnswerAttatchmentProps, id?: UniqueEntityId) {
    const attatchment = new AnswerAttachment(props, id)

    return attatchment
  }
}