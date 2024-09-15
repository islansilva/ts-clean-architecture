import Address from "../../../../domain/customer/value-object/address";
import Customer from "../../../../domain/customer/entity/customer";
import CustomerRepositoryInterface from "../../../../domain/@shared/repository/customer-repository.interface";
import CustomerModel from "./customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {

    async create(entity: Customer): Promise<void> {
        
        await CustomerModel.create({
            id: entity.id,
            name: entity.name, 
            city: entity.address.city,
            number: entity.address.number,
            zipcode: entity.address.zip,
            street: entity.address.street,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
        });

    }
    async update(entity: Customer): Promise<void> {
        await CustomerModel.update(
            {
                name: entity.name, 
                city: entity.address.city,
                number: entity.address.number,
                zipcode: entity.address.zip,
                street: entity.address.street,
                active: entity.isActive(),
                rewardPoints: entity.rewardPoints,
            },
            {
                where: {
                    id: entity.id
                }
            }
        );
    }

    async find(id: string): Promise<Customer> {
        let customerModel;

        try {
            customerModel = await CustomerModel.findOne({
                where: {
                    id
                },
                rejectOnEmpty: true, //Rejeita a Promise
            });
        } catch (error) {
            throw new Error("Customer not found");
        }

        const customer = new Customer(id, customerModel.name);
        const address = new Address(customerModel.street, customerModel.number, customerModel.zipcode, customerModel.city);

        customer.changeAddress(address);
        customer.addRewardPoints(customerModel.rewardPoints);

        if(customerModel.active) {
            customer.activate();
        }

        return customer;


    }

    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll();

        const customers = customerModels.map((customerModel) => {
            let customer =  new Customer(customerModel.id, customerModel.name);
            const address = new Address(customerModel.street, customerModel.number, customerModel.zipcode, customerModel.city);

            customer.changeAddress(address);
            customer.addRewardPoints(customerModel.rewardPoints);
            
            if(customerModel.active) {
                customer.activate();
            }
            
            return customer;
        });

        return customers;
    }

}