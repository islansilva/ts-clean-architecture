import express, {Request, Response} from 'express'; 
import OutputMapper from '../../../domain/@shared/utils/outputmapper.utils';
import CreateProductUseCase from '../../../usecase/product/create/create.product.usecase';
import ProductRepository from '../../product/repository/sequelize/product.repository';
import UpdateProductUseCase from '../../../usecase/product/update/update.product.usecase';
import FindProductUseCase from '../../../usecase/product/find/find.product.usecase';
import ListProductUseCase from '../../../usecase/product/list/list.product.usecase';

export const productRoute = express.Router();

productRoute.post("/",  async (req: Request, res: Response) => {
    const useCase = new CreateProductUseCase(new ProductRepository());


    try {
        const input = {
            type: req.body.type,
            name: req.body.name,
            price: req.body.price
        }

        const result = await useCase.execute(input);
        res.send(result);
    } catch (err) {
        res.status(500).send(err);
    }
})


productRoute.put("/",  async (req: Request, res: Response) => {
    const useCase = new UpdateProductUseCase(new ProductRepository());


    try {
        const input = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price
        }

        const result = await useCase.execute(input);
        res.send(result);
    } catch (err) {
        res.status(500).send(err);
    }
})


productRoute.get("/:id",  async (req: Request, res: Response) => {
    const useCase = new FindProductUseCase(new ProductRepository());
    const productId = req.params.id;

    try {
        const input = {
            id: productId
        }

        const result = await useCase.execute(input);
        res.send(result);
    } catch (err) {
        res.status(500).send(err);
    }
})


productRoute.get("/",  async (req: Request, res: Response) => {
    const useCase = new ListProductUseCase(new ProductRepository());

    try {

        const result = await useCase.execute({});
        res.send(result);
    } catch (err) {
        res.status(500).send(err);
    }
})