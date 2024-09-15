import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {

    it("should throw error when id is empty", () => {
        
        expect(() => {
            let customer = new Order("", "123", []);
        }).toThrow("Id is required");
    })

    it("should throw error when customerId is empty", () => {
        
        expect(() => {
            let customer = new Order("123", "", []);
        }).toThrow("CustomerId is required");
    })

    it("should throw error when customerId is empty", () => {
        
        expect(() => {
            let customer = new Order("123", "123", []);
        }).toThrow("Items are required");
    })

    it("should calculate total", () => {
        //Arrange
        const item1 = new OrderItem("1", "p1", "Item 1", 100, 3);
        const item2 = new OrderItem("2", "p2", "Item 2", 150, 2);
        const order = new Order("1", "Customer1", [item1, item2]);

        let total = order.total();

        expect(total).toBe(600);

    })


    it("should throw error the item qtd is less ", () => {
        expect(() => {
            const item1 = new OrderItem("1", "p1", "Item 1", 100, -2);
            const order = new Order("1", "Customer1", [item1]);


        }).toThrow("Quantity must be greater than 0");
    })

    it("should add items in order", () => {

        const item1 = new OrderItem("1", "p1", "Item 1", 100, 200);
        const order = new Order("1", "Customer1", [item1]);

        expect(order.items).toHaveLength(1);

        const item2 = new OrderItem("2", "p2", "Item 2", 100, 45);
        const item3 = new OrderItem("3", "p2", "Item 2", 100, 45);

        order.addItems([item2, item3]);

        expect(order.items).toHaveLength(3);

    })

    it("should throw error the item qtd is equal zero", () => {

        expect(() => {
            const item1 = new OrderItem("1", "p1", "Item 1", 100, 0);
            const order = new Order("1", "Customer1", [item1]);
        }).toThrow("Quantity must be greater than 0");


    })


})