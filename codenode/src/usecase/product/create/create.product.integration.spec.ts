import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase";

describe("Integration test create product use case", () => {
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


    it("should create a product", async() => {
        const productRepository = new ProductRepository();
        const useCase = new CreateProductUseCase(productRepository);

        const input = {
            type: "a",
            name: "Product",
            price: 100
        }

        const output = {
            id: expect.any(String),
            type: "a",
            name: "Product",
            price: 100
        }

        const result = await useCase.execute(input);

        expect(result).toEqual(output);


    })

})