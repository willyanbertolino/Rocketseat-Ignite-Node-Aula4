import { Either, left, right } from "../../../../core/either";
import { QuestionsCommentRepository } from "../repositories/question-comment-repository";
import { NotAllowedError } from "../../../../core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";

interface DeleteQuestionCommentUseCaseRequest {
    authorId: string
    questionCommentId: string
}

type DeleteQuestionCommentUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

export class DeleteQuestionCommentUseCase {
    constructor (
        private questionsCommentRepository: QuestionsCommentRepository
    ) {}

    async execute({ questionCommentId, authorId }: DeleteQuestionCommentUseCaseRequest): 
        Promise<DeleteQuestionCommentUseCaseResponse> {
        const questionComment = await this.questionsCommentRepository.findById(questionCommentId)

        if(!questionComment) {
            return left(new ResourceNotFoundError())
        }

        if(authorId !== questionComment.authorId.toString()) {
            return left(new NotAllowedError())
        }

        await this.questionsCommentRepository.delete(questionComment)

        return right({})
    }
}