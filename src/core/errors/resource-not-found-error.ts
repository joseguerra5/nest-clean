import { UseCaseError } from '@/core/error/use-case-error'

// implementa a interface para reconhecer o error facilmente gerado pro nossa app
export class ResouceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Resource nor found')
  }
}
