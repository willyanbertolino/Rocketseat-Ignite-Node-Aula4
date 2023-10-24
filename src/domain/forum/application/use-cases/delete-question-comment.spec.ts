import { expect, it, beforeEach, describe } from 'vitest'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { InMemoryQuestionCommentRepository } from '../../../../../test/repositories/in-memory-question-comment-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from '../../../../../test/factories/make-question-comment'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'

let inMemoryQuestionsCommentRepository: InMemoryQuestionCommentRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
    beforeEach(() => {
        inMemoryQuestionsCommentRepository = new InMemoryQuestionCommentRepository()
        sut = new DeleteQuestionCommentUseCase(inMemoryQuestionsCommentRepository)
    })

    it('should be able to delete a question comment', async () => {
        const questionComment = makeQuestionComment()

        await inMemoryQuestionsCommentRepository.create(questionComment)

        await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: questionComment.authorId.toString(),
        })
        
        expect(inMemoryQuestionsCommentRepository.items).toHaveLength(0)
    })

    it('should not be able to delete another user question comment', async () => {
        const questionComment = makeQuestionComment({
            authorId: new UniqueEntityID('author-1')
        })

        await inMemoryQuestionsCommentRepository.create(questionComment)

        const result = await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: 'author-2'
        })
        
        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

})