import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import ProductInterface from "../../../domain/product/entity/product.interface";
import Product from "../../../domain/product/entity/product";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";



describe("Integration test list product use case", () => {
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

    it("should list all products", async() => {
        const productRepository = new ProductRepository();
        const product1 = ProductFactory.create("a", "Product 1", 100);
        const product2 = ProductFactory.create("b", "Product 1", 100);

        const useCase = new ListProductUseCase(productRepository);
        const resultListProductsCreated = await createSetUpProductA(productRepository, [product1, product2]);

        const input = {}

        const result = await useCase.execute(input);

        expect(resultListProductsCreated.length).toBe(2);
        expect(result.products.length).toBe(2);

        expect(result.products[0].id).toEqual(product1.id)
        expect(result.products[0].name).toEqual(product1.name)
        expect(result.products[0].price).toEqual(product1.price)

        expect(result.products[1].id).toEqual(product2.id)
        expect(result.products[1].name).toEqual(product2.name)
        expect(result.products[1].price).toEqual(product2.price)

    })



    async function createSetUpProductA(productRepository: ProductRepositoryInterface, products: ProductInterface[]): Promise<ProductInterface[]> {

        const result: ProductInterface[] = [];

        products.map((product) => {
            productRepository.create(product);
            result.push(product);
        })
        

        return result
    }

})