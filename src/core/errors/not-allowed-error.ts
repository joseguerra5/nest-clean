import { UseCaseError } from "@/core/error/use-case-error";

// implementa a interface para reconhecer o error facilmente gerado pro nossa app
export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super("Not allowed.")
  }
}