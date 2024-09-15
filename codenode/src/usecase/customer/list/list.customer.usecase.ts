import CustomerRepositoryInterface from "../../../domain/@shared/repository/customer-repository.interface";
import OutputMapper, { MapperFunction } from "../../../domain/@shared/utils/outputmapper.utils";
import Customer from "../../../domain/customer/entity/customer";
import { CustomerDto, InputListCustomerDto, OutputListCustomerDto } from "./list.customer.dto";

export default class ListCustomerUseCase {
    private customerRepository: CustomerRepositoryInterface;

    private outputMapper: OutputMapper<Customer, CustomerDto>;

    constructor(customerRepository: CustomerRepositoryInterface, outputMapper: OutputMapper<Customer, CustomerDto>) {
        this.customerRepository = customerRepository;
        this.outputMapper = outputMapper;
    }

    async execute(input: InputListCustomerDto) : Promise<OutputListCustomerDto> {
        const customers = await this.customerRepository.findAll()
        this.outputMapper.mapperFunction = customerMapper;
        
        const output = this.outputMapper.inputListToMapperOutputList(customers)
        
        return {customers: output}
    }
}

const customerMapper :  MapperFunction<Customer, CustomerDto> = (customer) => ({
    id: customer.id,
    name: customer.name,
    address: {
      street: customer.address.street,
      number: customer.address.number,
      zip: customer.address.zip,
      city: customer.address.city,
    },
  })




