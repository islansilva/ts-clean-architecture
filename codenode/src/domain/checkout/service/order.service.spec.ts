import Customer from "../../customer/entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item"
import OrderService from "./order.service";

describe("Order Service unit tests", () => {
    it("should get total of all orders", () => {

        const item1 = new OrderItem("i1", "prod 1", "item 1", 200, 2);
        const item2 = new OrderItem("i2", "prod 2", "item 3", 50, 3);

        const order1 = new Order("1", "c1", [item1]);
        const order2 = new Order("2", "c2", [item2]); 

        const total = OrderService.total([order1, order2]);

        expect(total).toBe(550);
        

    });
    
it("should place an order", () => {

    const customer = new Customer("c1", "Cliente 1");
    const item1 = new OrderItem("o1", "p1", "Item1", 20, 2);

    const order = OrderService.placeOrder(customer, [item1]);

    expect(customer.rewardPoints).toBe(20);
    expect(order.total()).toBe(40);

});

})