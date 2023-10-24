import { Either, right } from "../../../../core/either";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentRepository } from "../repositories/answer-comment-repository";

interface FetchAnswerCommentsRequest {
    answerId: string
    page: number
}

type FetchAnswerCommentsResponse = Either< null, {
    answerComments: AnswerComment[]
}>


export class FetchAnswerCommentsUseCase {
    constructor (
        private answerCommentRepository: AnswerCommentRepository
    ) {}

    async execute({ page, answerId }: FetchAnswerCommentsRequest): 
        Promise<FetchAnswerCommentsResponse> {
        const answerComments = await this.answerCommentRepository
            .findManyByAnswerId(answerId, { page })

        return right({
            answerComments
        })
    }
}