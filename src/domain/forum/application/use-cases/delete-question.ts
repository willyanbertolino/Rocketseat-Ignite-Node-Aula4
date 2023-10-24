
import { Either, left, right } from "../../../../core/either";
import { QuestionsRepository } from "../repositories/question-repository";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";

interface DeleteQuestionsUseCaseRequest {
    authorId: string
    questionId: string
}

type DeleteQuestionsUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

export class DeleteQuestionsUseCase {
    constructor (
        private questionsRepository: QuestionsRepository
    ) {}

    async execute({ questionId, authorId }: DeleteQuestionsUseCaseRequest): 
        Promise<DeleteQuestionsUseCaseResponse> {
        const question = await this.questionsRepository.findById(questionId)

        if(!question) {
            return left(new ResourceNotFoundError())
        }

        if(authorId !== question.authorId.toString()) {
            return left(new NotAllowedError())
        }


        await this.questionsRepository.delete(question)

        return right({})
    }
}