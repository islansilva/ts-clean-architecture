import ProductFactory from "../../../domain/product/factory/product.factory"
import FindProductUseCase from "./find.product.usecase";


const product = ProductFactory.create("a", "Product A", 100);


const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    }
}


describe("Unit test find product use case", () => {

    it("should find a product", async() => {
        const mockRepository = MockRepository();
        const useCase = new FindProductUseCase(mockRepository);

        const input = {
            id:product.id
        }

        const output = {
            id: product.id,
            name: "Product A",
            price: 100
        }

        const result = await useCase.execute(input)

        expect(result).toEqual(output)
        
    })

    it("shoud not find a product", async() => {
        const mockRepository = MockRepository();
        mockRepository.find.mockImplementation(() => {
            throw new Error("Product not found")
        })

        const useCase = new FindProductUseCase(mockRepository);

        const input = {
            id: "321"
        }

        expect(() => {
            return useCase.execute(input)
        }).rejects.toThrow("Product not found")
    })

})