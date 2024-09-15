import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUseCase from "./find.customer.usecase";

const customer = new Customer("123", "John");
const address = new Address("Street", 123, "01234-123", "Sao Paulo");
customer.changeAddress(address);

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}


describe("Unit test find customer use case", () => {


    it("should find a costumer", async() => {       
        const customerRepository = MockRepository();
        const usecase = new FindCustomerUseCase(customerRepository);

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


    it("should not find a costumer", async() => {       
        const customerRepository = MockRepository();
        customerRepository.find.mockImplementation(() => {
            throw new Error("Customer not found");
        })
        const usecase = new FindCustomerUseCase(customerRepository);

        const input = {
            id: "123",
        }

        expect( () => {
            return usecase.execute(input);
        }).rejects.toThrow("Customer not found");

    })



});