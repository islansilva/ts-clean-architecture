import { CustomerDto } from './../../../usecase/customer/list/list.customer.dto';
import OutputMapper, { MapperFunction } from './outputmapper.utils';
import CustomerFactory from "../../customer/factory/customer.factory"
import Address from "../../customer/value-object/address"
import Customer from '../../customer/entity/customer';


const mapperFunction: MapperFunction<Customer, CustomerDto> = (customer) => ({
    id: customer.id,
    name: customer.name,
    address: {
      street: customer.address.street,
      number: customer.address.number,
      zip: customer.address.zip,
      city: customer.address.city,
    },
})

describe("Unit test output mapper", () => {


    it("should transform the input throught of a mapper", () => {
        const customer = CustomerFactory.createWithAddress("John",
            new Address("Street", 123, "Zip", "City"))

        const outputMapper = new OutputMapper<Customer, CustomerDto>();
        outputMapper.mapperFunction = mapperFunction;
        const customerDto = outputMapper.inputListToMapperOutputList([customer]);

        expect(customerDto.length).toBe(1);
        expect(customerDto[0].id).toBe(customer.id);
        expect(customerDto[0].name).toBe(customer.name);
        expect(customerDto[0].address.street).toBe(customer.address.street);
        expect(customerDto[0].address.number).toBe(customer.address.number);
        expect(customerDto[0].address.zip).toBe(customer.address.zip);
        expect(customerDto[0].address.city).toBe(customer.address.city);
    })

    it("should throw error when mapperfunction is not defined", () => {
        const customer = CustomerFactory.createWithAddress("John",
            new Address("Street", 123, "Zip", "City"))

        const outputMapper = new OutputMapper<Customer, CustomerDto>();
        
        expect(() => {
            return outputMapper.inputListToMapperOutputList([customer])
        }).toThrow("The mapper function has not been defined")

    })

}) 