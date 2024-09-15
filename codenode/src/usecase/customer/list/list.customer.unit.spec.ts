import { CustomerDto, InputListCustomerDto } from './list.customer.dto';
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import ListCustomerUseCase from "./list.customer.usecase";
import Customer from '../../../domain/customer/entity/customer';
import OutputMapper from '../../../domain/@shared/utils/outputmapper.utils';

const customer1 = CustomerFactory.createWithAddress("John",
    new Address("Street 1",
        123,
        "Zip 1",
        "Citi 1"
    )
);


const customer2 = CustomerFactory.createWithAddress("Jane",
    new Address("Street 2",
        456,
        "Zip 2",
        "Citi 2"
    )
);

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([customer1, customer2])),
        create: jest.fn(),
        update: jest.fn()
    }
}

describe("Unit test for list customer usecase", () => {


    it("should to list all customers", async() => {
        const repository = MockRepository();
        const outputMapper = new OutputMapper<Customer, CustomerDto>();
        const useCase = new ListCustomerUseCase(repository, outputMapper);
        const input = {}

        const output = await useCase.execute(input);

        expect(output.customers.length).toBe(2);

        expect(output.customers[0].id).toBe(customer1.id);
        expect(output.customers[0].name).toBe(customer1.name);
        expect(output.customers[0].address.street).toBe(customer1.address.street);

        expect(output.customers[1].id).toBe(customer2.id);
        expect(output.customers[1].name).toBe(customer2.name);
        expect(output.customers[1].address.street).toBe(customer2.address.street);

    })

})