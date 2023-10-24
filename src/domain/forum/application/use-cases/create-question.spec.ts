import { expect, it, beforeEach, describe } from 'vitest'
import { CreateQuestionsUseCase } from './create-question'
import { InMemoryQuestionsRepository } from '../../../../../test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: CreateQuestionsUseCase

describe('Create Questions', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository(),
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
        sut = new CreateQuestionsUseCase(inMemoryQuestionsRepository)
    })
    it('should be able to create a question', async () => {
        const result = await sut.execute({
            authorId: '1', 
            title: 'Nova pergunta',
            content: 'Conteudo da pergunta',
            attachmentsIds: ['1', '2']
        })
    
        expect(result.isRight()).toBe(true)
        expect(inMemoryQuestionsRepository.items[0]).toEqual(result.value?.question)
        expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({attachmentId: new UniqueEntityID('1')}),
            expect.objectContaining({attachmentId: new UniqueEntityID('2')}),
        ])
    })

})