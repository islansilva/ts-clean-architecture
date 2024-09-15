import EventHandlerInterface from "../../../@shared/event/event-hander.interface";
import EventInterface from "../../../@shared/event/event.interface";
import CustomerCreatedEvents from "../customer-created.event";

export default class Log1CustomerIsCreatedHandler implements EventHandlerInterface<CustomerCreatedEvents> {
    handle(event: CustomerCreatedEvents): void {
        console.log(`Esse é o primeiro console.log do evento: CustomerCreated.`)
    }

}