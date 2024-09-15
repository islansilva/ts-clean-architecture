import CreateProductUseCase from "./create.product.usecase";


const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    }
}

describe("Unit test create product use case", () => {

    it("should create a product", async () => {
        const mockRepository = MockRepository();
        const useCase = new CreateProductUseCase(mockRepository);

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

    it("should throw an error when creating a product with a value less than zero", async () => {
        const mockRepository = MockRepository();
        const useCase = new CreateProductUseCase(mockRepository);

        const input = {
            type: "a",
            name: "Product",
            price: -1
        }

        expect(useCase.execute(input)).rejects.toThrow("Price must be greater than zero")
    })

    it("should throw an error when creating a product with an empty name", async () => {
        const mockRepository = MockRepository();
        const useCase = new CreateProductUseCase(mockRepository);

        const input = {
            type: "a",
            name: "",
            price: 3
        }

        expect(useCase.execute(input)).rejects.toThrow("Name is required")
    })

})