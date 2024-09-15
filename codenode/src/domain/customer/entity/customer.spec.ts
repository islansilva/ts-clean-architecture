import Customer from "./customer"
import Address from "../value-object/address";

describe("Customer unit tests", () => {
    it("should throw error when id is empty", () => {
        
        expect(() => {
            let customer = new Customer("", "Islan");
        }).toThrow("customer: Id is required");
    })

    it("should throw error when name is empty", () => {
        
        expect(() => {
            let customer = new Customer("123", "");
        }).toThrow("customer: Name is required");
    })

    it("should throw error when name and id are empty", () => {
        
        expect(() => {
            let customer = new Customer("", "");
        }).toThrow("customer: Name is required,customer: Id is required");
    })

    it("should changename", () => {
        
        //Triple A

        // Arrange
        let customer = new Customer("123", "John");

        // Act
        customer.changeName("Jane");

        // Assert
        expect(customer.name).toBe("Jane");
    })

    it("should activate customer", () => {
        const customer = new Customer ("1", "Customer 1");
        const address = new Address("Street 1",123, "01234-212", "São Paulo");
        customer.Address = address;

        customer.activate();

        expect(customer.isActive()).toBe(true);

    })

    it("should throw error when address is undefined when you activate a customer", () => {
        const customer = new Customer ("1", "Customer 1");

        

        expect(() => {
            customer.activate();
        }).toThrow("Address is required");

    })


    it("should deactivate customer", () => {
        const customer = new Customer ("1", "Customer 1");
        customer.desactivate();

        expect(customer.isActive()).toBe(false);

    })

    it("should add reward points", () => {
        const customer = new Customer("1", "Customer1");

        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(15);
        expect(customer.rewardPoints).toBe(25);
    })

})