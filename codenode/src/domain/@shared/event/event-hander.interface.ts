import EventInterface from "./event.interface";

export default interface EventHandlerInterface<T extends EventInterface=EventInterface> { //O EventInterface=EventInterface, garante que o valor padrão seja EventInterface
    handle(event: T): void;
}