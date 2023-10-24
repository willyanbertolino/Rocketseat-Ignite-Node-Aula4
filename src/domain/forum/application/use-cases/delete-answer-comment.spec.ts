import { expect, it, beforeEach, describe } from 'vitest'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { InMemoryAnswerCommentRepository } from '../../../../../test/repositories/in-memory-answer-comment-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from '../../../../../test/factories/make-answer-comment'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
    beforeEach(() => {
        inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()
        sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentRepository)
    })

    it('should be able to delete a answer comment', async () => {
        const answerComment = makeAnswerComment()

        await inMemoryAnswerCommentRepository.create(answerComment)

        await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: answerComment.authorId.toString(),
        })
        
        expect(inMemoryAnswerCommentRepository.items).toHaveLength(0)
    })

    it('should not be able to delete another user question comment', async () => {
        const answerComment = makeAnswerComment({
            authorId: new UniqueEntityID('author-1')
        })

        await inMemoryAnswerCommentRepository.create(answerComment)

        const result = await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: 'author-2'
        })
        
        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

})