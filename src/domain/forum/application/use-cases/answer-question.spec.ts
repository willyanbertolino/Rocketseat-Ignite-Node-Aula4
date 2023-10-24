import { expect, it, describe, beforeEach } from 'vitest'
import { AnswerQuestionsUseCase } from './answer-question'
import { InMemoryAnswersRepository } from '../../../../../test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from '../../../../../test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: AnswerQuestionsUseCase

describe('Create Answer', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
        sut = new AnswerQuestionsUseCase(inMemoryAnswersRepository)
    })
    it('should be able to create an answer for a question', async () => {
        const result = await sut.execute({
            questionId: '1', 
            instructorId: '1', 
            content: 'Conteudo da resposta',
            attachmentsIds: ['1', '2']
        })
    
        expect(result.isRight()).toBe(true)
        expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer)
        expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({attachmentId: new UniqueEntityID('1')}),
            expect.objectContaining({attachmentId: new UniqueEntityID('2')}),
        ])
    })

})