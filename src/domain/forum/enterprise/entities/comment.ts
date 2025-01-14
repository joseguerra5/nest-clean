import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface CommentProps {
  authorId: UniqueEntityId
  content: string
  createdAt: Date
  updatedAt?: Date
}

// classe abstrata para ser extendida por outras classes
export abstract class Comment<Props extends CommentProps> extends Entity<Props> {
  // evita que outras propriedades acessam a propriedade comment e não são manipuladas diretamente
  get authorId() {
    return this.props.authorId
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

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  // metodo privado para atualizar o updatedAt
  private touch() {
    this.props.updatedAt = new Date()
  }

}
