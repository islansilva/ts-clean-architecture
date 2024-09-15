import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";


const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    }
}

describe("Unit test update product use case", () => {

    it("should update a product", async () => {
        const mockRepository = MockRepository();
        const useCase = new UpdateProductUseCase(mockRepository);

        const product = ProductFactory.create("a", "Product", 100);

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

    it("should throw an error when updating a product with a value less than zero", async () => {
        const mockRepository = MockRepository();
        const useCase = new UpdateProductUseCase(mockRepository);

        const product = ProductFactory.create("a", "Product", 5);

        const input = {
            id: product.id,
            name: "New Product",
            price: -5
        }

        expect(useCase.execute(input)).rejects.toThrow("Price must be greater than zero")
    })

    it("should throw an error when updating a product with an empty name", async () => {
        const mockRepository = MockRepository();
        const useCase = new UpdateProductUseCase(mockRepository);

        const product = ProductFactory.create("a", "Product", 5);

        const input = {
            id: product.id,
            name: "",
            price: 500
        }
        expect(useCase.execute(input)).rejects.toThrow("Name is required")
    })

    it("should throw an error when updating a product with an empty id", async () => {
        const mockRepository = MockRepository();
        const useCase = new UpdateProductUseCase(mockRepository);

        const product = ProductFactory.create("a", "Product", 5);

        const input = {
            id: "",
            name: "New Product",
            price: 500
        }
        expect(useCase.execute(input)).rejects.toThrow("Id is required")
    })

})