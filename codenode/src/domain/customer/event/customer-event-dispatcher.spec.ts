import Address from "../../customer/value-object/address";
import Log1CustomerIsCreatedHandler from "../../customer/event/handler/log1-when-customer-is-created";
import Log2CustomerIsCreatedHandler from "../../customer/event/handler/log2-when-customer-is-created";
import CustomerCreatedEvents from "../../customer/event/customer-created.event";
import Customer from "../../customer/entity/customer";
import LogCustomerAddressChangedHandler from "../../customer/event/handler/log-when-customer-address-is-changed.handler";
import CustomerAddressChangedEvent from "../../customer/event/customer-address-changed.event";
import EventDispatcher from "../../@shared/event/event-dispatcher";

describe("Customer domain events tests", () => {

    it("should register an event handler when customer is created", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new Log1CustomerIsCreatedHandler();

        eventDispatcher.register("CustomerCreatedEvents", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvents"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvents"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvents"][0]).toMatchObject(eventHandler);

    });

    it("should unregister an event handler of type Customer", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new Log1CustomerIsCreatedHandler();

        eventDispatcher.register("CustomerCreatedEvents", eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvents"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("CustomerCreatedEvents", eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvents"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvents"].length).toBe(0);
    

    })


    it("should unregister all event handlers of type Customer", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new Log1CustomerIsCreatedHandler();

        eventDispatcher.register("CustomerCreatedEvents", eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvents"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvents"]).toBeUndefined();
    

    })

    it("should notify all events handler when Customer is created", () => {
        const eventDispatcher = new EventDispatcher();
        const eventLog1Handler = new Log1CustomerIsCreatedHandler();
        const eventLog2Handler = new Log2CustomerIsCreatedHandler();

        const spyEvent1Handler = jest.spyOn(eventLog1Handler, "handle");
        const spyEvent2Handler = jest.spyOn(eventLog2Handler, "handle");

        eventDispatcher.register("CustomerCreatedEvents", eventLog1Handler);
        eventDispatcher.register("CustomerCreatedEvents", eventLog2Handler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvents"][0]).toMatchObject(eventLog1Handler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvents"][1]).toMatchObject(eventLog2Handler);

        const customerCreatedEvent = new CustomerCreatedEvents(new Customer("customerId1","Customer 1"))

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEvent1Handler).toHaveBeenCalled();
        expect(spyEvent2Handler).toHaveBeenCalled();
    })

    it("should notify all events handler when the customer address changes", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new LogCustomerAddressChangedHandler();

        const spyEventHandler = jest.spyOn(eventHandler, "handle")

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(eventHandler);

        const customerAddressChangedEvent = new CustomerAddressChangedEvent({
            id: "customerId1",
            nome: "Customer 1",
            endereco: new Address(
                "Rua 1", 3, "12345-678", "Sao Paulo"
            ).toString()
        }) 

        eventDispatcher.notify(customerAddressChangedEvent);
        expect(spyEventHandler).toHaveBeenCalled();

    })

});