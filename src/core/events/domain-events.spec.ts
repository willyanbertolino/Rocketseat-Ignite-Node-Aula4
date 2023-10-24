import { describe, expect, it, vi } from "vitest";
import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityID } from "../entities/unique-entity-id";
import { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";

class CustomAggregateCreated implements DomainEvent{
    public ocurredAt: Date
    private aggregate: CustomAggregate

    constructor(aggregate: CustomAggregate) {
        this.ocurredAt = new Date()
        this.aggregate = aggregate
    }

    getAggregateId(): UniqueEntityID {
        return this.aggregate.id
    }

    
}

class CustomAggregate extends AggregateRoot<null> {
    static create() {
        const aggregate = new CustomAggregate(null)

        aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

        return aggregate
    }
}

describe('Domain Events', () => {
    it('should be able to dispach and listen to events', () => {
        const callBackSpy = vi.fn()

        DomainEvents.register(callBackSpy, CustomAggregateCreated.name)

        const aggregate = CustomAggregate.create()

        expect(aggregate.domainEvents).toHaveLength(1)

        DomainEvents.dispatchEventsForAggregate(aggregate.id)

        expect(callBackSpy).toBeCalled()
        expect(aggregate.domainEvents).toHaveLength(0)
    })
})