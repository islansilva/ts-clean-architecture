import { Sequelize } from "sequelize-typescript";
import CustomerModel from "./customer.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
describe("Customer repository test", () => {


    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true},
        });
        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    })

    

    afterEach(async () => {
        await sequelize.close;
    })

    it("should create a customer", async() => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Cliente 1");
        const address = new Address("Rua 1", 123, "12345-123", "SP");
        customer.Address = address;
    
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({where: {id: "1"}});

        expect(customerModel.toJSON()).toStrictEqual({
            id: "1",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: customer.address.street,
            number: customer.address.number,
            zipcode: customer.address.zip,
            city: customer.address.city
        });
    })

    it("should update a customer", async() =>  {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Cliente 1");
        const address = new Address("Rua 1", 123, "12345-123", "SP");
        customer.Address = address;
        await customerRepository.create(customer);

        customer.changeName("Cliente 2");
        await customerRepository.update(customer);

        const customerModel = await CustomerModel.findOne({where: {id: "1"}}); 

        expect(customerModel.toJSON()).toStrictEqual({
            id: "1",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: customer.address.street,
            number: customer.address.number,
            zipcode: customer.address.zip,
            city: customer.address.city
        });
    })



    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Cliente 1");
        const address = new Address("Rua 1", 123, "12345-123", "SP");
        customer.Address = address;
        await customerRepository.create(customer);

        const customerResult = await customerRepository.find(customer.id);

        expect(customer).toStrictEqual(customerResult);
    })


    it("should find all costumer", async () => {
        const customerRepository = new CustomerRepository();

        const customer = new Customer("1", "Cliente 1");
        const address = new Address("Rua 1", 123, "12345-123", "SP");
        customer.Address = address;
        customer.activate();
        customer.addRewardPoints(20);
        
        
        const customer2 = new Customer("2", "Cliente 1");
        const address2 = new Address("Rua 1", 123, "12345-123", "SP");
        customer2.Address = address2;

        await customerRepository.create(customer);
        await customerRepository.create(customer2);


        const foundCostumer = await customerRepository.findAll();

        expect(foundCostumer).toHaveLength(2);
        expect(foundCostumer).toContainEqual(customer);
        expect(foundCostumer).toContainEqual(customer2);


    });

    it("should  throw an error when costumer is not found", async() => {
        const customerRepository = new CustomerRepository();

        expect( async () => {
            await customerRepository.find("zxcbvc");
        }).rejects.toThrow("Customer not found");

    });

});