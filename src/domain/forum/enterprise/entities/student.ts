import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
interface StudentProps {
  name: string
  email: string
  password: string
}

export class Student extends Entity<StudentProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }
  
  // o ID é opcional porque o construtor muita das vezes não vamos criar o student do zero
  static create(props: StudentProps, id?: UniqueEntityId): Student {
    const student = new Student(props, id)

    return student
  }
}
