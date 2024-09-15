import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import Product from "../../../domain/product/entity/product";
import ProductInterface from "../../../domain/product/entity/product.interface";
import FindProductUseCase from "./find.product.usecase";


describe("Integration test find product use case", () => {

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

    
    it("should find a product", async() => {
        const productRepository = new ProductRepository();
        var listProductCreated: ProductInterface[];

        const product1 = ProductFactory.create("a", "Product 1", 100);
        listProductCreated = await createSetUpProductA(productRepository, [product1]);

        const useCase = new FindProductUseCase(productRepository);

        const input = {
            id: product1.id
        }

        const output = {
            id: listProductCreated[0].id,
            name: listProductCreated[0].name,
            price: listProductCreated[0].price
        }

        const result = await useCase.execute(input);
        expect(result).toEqual(output);
    })

    
    it("should not a find a product", async() => {
        const productRepository = new ProductRepository();
        var listProductCreated: ProductInterface[];

        const product1 = ProductFactory.create("a", "Product 1", 100);
        const product2 = ProductFactory.create("a", "Product 2", 100);

        listProductCreated = await createSetUpProductA(productRepository, [product1, product2]);

        const useCase = new FindProductUseCase(productRepository);

        const input = {
            id: "321z"
        }

        const output = {
            id: listProductCreated[0].id,
            name: listProductCreated[0].name,
            price: listProductCreated[0].price
        }

        expect(() => {
            return useCase.execute(input)
        }).rejects.toThrow("Product not found")
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