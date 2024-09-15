import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";

describe("Integration test update product use case", () => {
    let sequelize: Sequelize;
    

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: {force: true},
        });
        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    })

     afterEach(async () => {
        await sequelize.close;
    });

    it("should update a product", async() => {
        const productRepository = new ProductRepository();
        const useCase = new UpdateProductUseCase(productRepository);

        const product = ProductFactory.create("a", "Product", 100);
        await productRepository.create(product);

        const input = {
            id: product.id,
            name: "New Product",
            price: 300
        }

        const result = await useCase.execute(input);

        expect(result).toEqual(
            {
                id: product.id,
                name: "New Product",
                price: 300
            }
        )



    })


})