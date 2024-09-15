import Order from "./domain/checkout/entity/order";
import OrderItem from "./domain/checkout/entity/order_item";
import Customer from "./domain/customer/entity/customer";
import Address from "./domain/customer/value-object/address";

let customer = new Customer("123", "Islan");
const address = new Address("Rua Canopo", 123, "09972-400", "Diadema");
customer.Address = address;
customer.activate();


const item1 = new OrderItem("1", "prod 1",  "Item 1", 10, 2);
const item2 = new OrderItem("2", "prod 2", "Item 2", 20, 3);

const order = new Order("1", "123", [item1, item2]);