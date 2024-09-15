
import EventHandlerInterface from "../../../@shared/event/event-hander.interface";
import EventInterface from "../../../@shared/event/event.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";
import CustomerCreatedEvents from "../customer-created.event";

export default class LogCustomerAddressChangedHandler implements EventHandlerInterface<CustomerAddressChangedEvent> {
    handle(event: CustomerAddressChangedEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.nome} alterado para: ${event.eventData.endereco}`);
    }
    

}