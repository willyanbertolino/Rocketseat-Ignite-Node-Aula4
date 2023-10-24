import { Either, right } from "../../../../core/either";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionsCommentRepository } from "../repositories/question-comment-repository";

interface FetchQuestionCommentsRequest {
    questionId: string
    page: number
}

type FetchQuestionCommentsResponse = Either< null, {
    questionComments: QuestionComment[]
}>


export class FetchQuestionCommentsUseCase {
    constructor (
        private questionsCommentRepository: QuestionsCommentRepository
    ) {}

    async execute({ page, questionId }: FetchQuestionCommentsRequest): 
        Promise<FetchQuestionCommentsResponse> {
        const questionComments = await this.questionsCommentRepository
            .findManyByQuestionId(questionId, { page })

        return right({
            questionComments
        })
    }
}