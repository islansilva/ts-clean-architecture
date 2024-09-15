import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";
import OrderRepository from "./order.repository";
describe("Order repository test", () => {


    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true},
        });
        await sequelize.addModels([CustomerModel,OrderItemModel, OrderModel, ProductModel]);
        await sequelize.sync();
    })

    

    afterEach(async () => {
        await sequelize.close;
    })

    it("should create a new order", async() => {
        //
        //Customer
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Cliente 1");
        const address = new Address("Rua 1", 123, "12345-123", "SP");
        customer.Address = address;
        await customerRepository.create(customer);
        //
        //Product
        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 100);
        await productRepository.create(product);
        //
        //Order and OrderItem
        const orderItem = new OrderItem("1", product.id, product.name, product.price, 2);
        const order = new Order("o1", customer.id, [orderItem])
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: {id: order.id},
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "o1",
            customer_id: "c1",
            total: order.total(),
            items: [{
                id: orderItem.id,
                name: orderItem.name,
                price: orderItem.price,
                quantity: orderItem.quantity,
                order_id: "o1",
                product_id: "p1"
            }]
        });
    });

    it("should update a order", async () => {
        //
        //Customer
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Cliente 1");
        const address = new Address("Rua 1", 123, "12345-123", "SP");
        customer.Address = address;
        await customerRepository.create(customer);
        //
        //Product
        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 100);
        await productRepository.create(product);
        //
        //Order and OrderItem
        const orderItem = new OrderItem("1", product.id, product.name, product.price, 2);
        const order = new Order("o1", customer.id, [orderItem])
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);
        //
        //Add items and update
        const product2 = new Product("p2", "Product 2", 150);
        await productRepository.create(product2);
        //
        const product3 = new Product("p3", "Product 3", 190);
        await productRepository.create(product3);
        //
        const orderItem2 = new OrderItem("2", product2.id, product2.name, product2.price, 2);
        const orderItem3 = new OrderItem("3", product3.id, product3.name, product3.price, 7);
        order.addItems([orderItem2, orderItem3]);

        await orderRepository.update(order);
        //
        const orderModel = await OrderModel.findOne(
            {
                where: {
                    id: "o1"
                },
                include: ["customer", "items"]
        }); 

        expect(orderModel.items).toHaveLength(3);
        
        expect(orderModel.toJSON()).toStrictEqual({
            id: "o1",
            customer_id: "c1",
            customer: {
                id: "c1",
                name: "Cliente 1",
                street: "Rua 1",
                number: 123,
                zipcode:"12345-123",
                city:"SP",
                active: true,
                rewardPoints: 0
            },
            items: [{
                id: orderItem.id,
                name: orderItem.name,
                price: orderItem.price,
                quantity: orderItem.quantity,
                order_id: "o1",
                product_id: "p1"
            },
            {
                id: orderItem2.id,
                name: orderItem2.name,
                price: orderItem2.price,
                quantity: orderItem2.quantity,
                order_id: "o1",
                product_id: "p2"
            },
            {
                id: orderItem3.id,
                name: orderItem3.name,
                price: orderItem3.price,
                quantity: orderItem3.quantity,
                order_id: "o1",
                product_id: "p3"
            }],
            total: 1830
            
        })
    })

    it("should find a order", async() => {
         //
        //Customer
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Cliente 1");
        const address = new Address("Rua 1", 123, "12345-123", "SP");
        customer.Address = address;
        await customerRepository.create(customer);
        //
        //Product
        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 100);
        await productRepository.create(product);
        //
        //Order and OrderItem
        const orderItem = new OrderItem("1", product.id, product.name, product.price, 2);
        const orderItem2 = new OrderItem("2", product.id, product.name, product.price, 2);
        const order = new Order("o1", customer.id, [orderItem, orderItem2])
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderResult = await orderRepository.find("o1");

        expect(order).toStrictEqual(orderResult);
    })

    it("should throw an error when order is not found", async () => {

        //
        //Customer
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Cliente 1");
        const address = new Address("Rua 1", 123, "12345-123", "SP");
        customer.Address = address;
        await customerRepository.create(customer);
        //
        //Product
        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 100);
        await productRepository.create(product);
        //
        //Order and OrderItem
        const orderItem = new OrderItem("1", product.id, product.name, product.price, 2);
        const order = new Order("o1", customer.id, [orderItem])
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        expect(async () => {
            await orderRepository.find("o2");
        }).rejects.toThrow("Order not found");
    })

    it("should find all orders", async () => {
        //
        //Customer
        const customerRepository = new CustomerRepository();
        const customer = new Customer("c1", "Cliente 1");
        const address = new Address("Rua 1", 123, "12345-123", "SP");
        customer.Address = address;
        await customerRepository.create(customer);
        //
        //Product
        const productRepository = new ProductRepository();
        const product = new Product("p1", "Product 1", 100);
        await productRepository.create(product);
        //
        //Order and OrderItem
        const orderItem = new OrderItem("1", product.id, product.name, product.price, 2);
        const orderItem2 = new OrderItem("2", product.id, product.name, product.price, 2);
        const order = new Order("o1", customer.id, [orderItem, orderItem2])
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);
        
        const orderItem3 = new OrderItem("3", product.id, product.name, product.price, 2);
        const orderItem4 = new OrderItem("4", product.id, product.name, product.price, 2);
        const order2 = new Order("o2", customer.id, [orderItem3, orderItem4])
        await orderRepository.create(order2);


        const orderResult = await orderRepository.findAll();

        expect(orderResult).toHaveLength(2);
        expect(orderResult).toContainEqual(order);
        expect(orderResult).toContainEqual(order2);

    })


});