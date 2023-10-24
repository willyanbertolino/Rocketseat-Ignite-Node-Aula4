import { Either, left, right } from "../../../../core/either";
import { UniqueEntityID } from "../../../../core/entities/unique-entity-id";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionsCommentRepository } from "../repositories/question-comment-repository";
import { QuestionsRepository } from "../repositories/question-repository";
import { ResourceNotFoundError } from "../../../../core/errors/errors/resource-not-found-error";

interface CommentOnQuestionsUseCaseRequest {
    authorId: string
    questionId: string
    content: string
}

type CommentOnQuestionsUseCaseResponse= Either<ResourceNotFoundError, {
    questionComment: QuestionComment
}>

export class CommentOnQuestionsUseCase {
    constructor (
        private questionsRepository: QuestionsRepository,
        private questionsCommentsRepository: QuestionsCommentRepository
    ) {}

    async execute({ authorId, questionId, content }: CommentOnQuestionsUseCaseRequest): 
        Promise<CommentOnQuestionsUseCaseResponse> {
        const question = await this.questionsRepository.findById(questionId)
        
        if(!question) {
            return left(new ResourceNotFoundError())
        }
        
        const questionComment = QuestionComment.create({
            authorId: new UniqueEntityID(authorId),
            questionId: new UniqueEntityID(questionId),
            content
        })

        await this.questionsCommentsRepository.create(questionComment)

        return right({
            questionComment
        })
    }
}