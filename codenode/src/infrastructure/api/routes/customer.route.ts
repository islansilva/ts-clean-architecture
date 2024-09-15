import express, {Request, Response} from 'express'; 
import CreateCustomerUseCase from '../../../usecase/customer/create/create.customer.usecase';
import CustomerRepository from '../../customer/repository/sequelize/customer.repository';
import ListCustomerUseCase from '../../../usecase/customer/list/list.customer.usecase';
import Customer from '../../../domain/customer/entity/customer';
import { CustomerDto } from '../../../usecase/customer/list/list.customer.dto';
import OutputMapper from '../../../domain/@shared/utils/outputmapper.utils';
import CustomerPresenter from '../presenters/customer.presenter';

export const customerRoute = express.Router();


customerRoute.post('/', async (req: Request, res: Response) => {
    const usecase = new CreateCustomerUseCase(new CustomerRepository());

    try {
        const customerDto = {
            name: req.body.name,
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
                number: req.body.address.number,
                zip: req.body.address.zip,
            }
        }
        const output = await usecase.execute(customerDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
})

customerRoute.get('/', async (req: Request, res: Response) => {
    const outputMapper = new OutputMapper<Customer, CustomerDto>();
    const usecase = new ListCustomerUseCase(new CustomerRepository(),outputMapper);
    const output = await usecase.execute({});

    try {        
    
        res.format({
            json: async() => res.send(output),
            xml: async() => res.send(CustomerPresenter.listXML(output))
        })


    } catch (err) {
        res.status(500).send(err);
    }
})