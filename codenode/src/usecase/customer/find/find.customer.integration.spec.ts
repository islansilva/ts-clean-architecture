import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUseCase from "./find.customer.usecase";

describe("Integration test find customer use case", () => {

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
    });

    it("should find a costumer", async() => {       
        const customerRepository = new CustomerRepository();
        const usecase = new FindCustomerUseCase(customerRepository);

        const customer = new Customer("123", "John");
        const address = new Address("Street", 123, "01234-123", "Sao Paulo");
        customer.changeAddress(address);

        await customerRepository.create(customer);

        const input = {
            id: "123",
        }

        const output = {
            id: "123",
            name: "John",
            address: {
                street: "Street",
                city: "Sao Paulo",
                number: 123,
                zip: "01234-123"
            }
        };

        const result = await usecase.execute(input);
        expect(result).toEqual(output);

    })



});