import ProductFactory from "../../../domain/product/factory/product.factory";
import ListProductUseCase from "./list.product.usecase";


const product1 = ProductFactory.create("a", "Product 1", 100);
const product2 = ProductFactory.create("b", "Product 1", 100);


const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
        create: jest.fn(),
        update: jest.fn()
    }
}


describe("Unit test list product use case", () => {

    it("should list all products", async() => {
        const mockRepository = MockRepository();
        const useCase = new ListProductUseCase(mockRepository);

        const input = {}
        const result = await useCase.execute(input);

        expect(result.products.length).toBe(2);

        expect(result.products[0].id).toEqual(product1.id)
        expect(result.products[0].name).toEqual(product1.name)
        expect(result.products[0].price).toEqual(product1.price)

        expect(result.products[1].id).toEqual(product2.id)
        expect(result.products[1].name).toEqual(product2.name)
        expect(result.products[1].price).toEqual(product2.price)
    })
})