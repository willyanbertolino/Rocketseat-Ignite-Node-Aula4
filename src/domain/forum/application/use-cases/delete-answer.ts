import { Either, left, right } from "../../../../core/either";
import { AnswerRepository } from "../repositories/answer-repository";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";

interface DeleteAnswerUseCaseRequest {
    authorId: string
    questionId: string
}

type DeleteAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

export class DeleteAnswerUseCase {
    constructor (
        private answerRepository: AnswerRepository
    ) {}

    async execute({ questionId, authorId }: DeleteAnswerUseCaseRequest): 
        Promise<DeleteAnswerUseCaseResponse> {
        const answer = await this.answerRepository.findById(questionId)

        if(!answer) {
            return left(new ResourceNotFoundError())
        }

        if(authorId !== answer.authorId.toString()) {
            return left(new NotAllowedError())
        }

        await this.answerRepository.delete(answer)

        return right({})
    }
}