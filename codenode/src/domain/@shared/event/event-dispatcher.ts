import EventDispatcherInterface from "./event-dispatcher.interface";
import EventHandlerInterface from "./event-hander.interface";
import EventInterface from "./event.interface";

export default class EventDispatcher implements EventDispatcherInterface {

    private eventsHandlers: {[eventName: string]: EventHandlerInterface[] } = {};

    get getEventHandlers(): {[eventName: string]: EventHandlerInterface[]} {
        return this.eventsHandlers;
    } 

    notify(event: EventInterface): void {
        const eventName = event.constructor.name;

        if(this.eventsHandlers[eventName]) {
            this.eventsHandlers[eventName].forEach((eventHandler) => {
                eventHandler.handle(event);
            })
        }
    }
    register(eventName: string, eventHandler: EventHandlerInterface<EventInterface>): void {
        
        if(!this.eventsHandlers[eventName]) {
            this.eventsHandlers[eventName] = [];
        }

        this.eventsHandlers[eventName].push(eventHandler);
    }

    unregister(eventName: string, eventHandler: EventHandlerInterface): void {
        if(this.eventsHandlers[eventName]) {
            const index = this.eventsHandlers[eventName].indexOf(eventHandler);

            if(index !== -1) {
                this.eventsHandlers[eventName].splice(index, 1);
            }
        }

        
    }
    unregisterAll(): void {
        this.eventsHandlers = {};
    }

}