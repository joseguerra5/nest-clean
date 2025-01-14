import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface AttatchmentProps {
  title: string
  link: string
}
export class Attatchment extends Entity<AttatchmentProps> {
  get title() {
    return this.props.title
  }

  get link() {
    return this.props.link
  }

  static create(props: AttatchmentProps, id?: UniqueEntityId) {
    const attatchment = new Attatchment(props, id)

    return attatchment
  }
}