import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface AttatchmentProps {
  title: string
  url: string
}
export class Attachment extends Entity<AttatchmentProps> {
  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }

  static create(props: AttatchmentProps, id?: UniqueEntityId) {
    const attatchment = new Attachment(props, id)

    return attatchment
  }
}