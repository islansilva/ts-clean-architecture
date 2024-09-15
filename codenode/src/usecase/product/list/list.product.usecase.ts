import OutputMapper, { MapperFunction } from './../../../domain/@shared/utils/outputmapper.utils';
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputListProductDto, OutputListProductDto, ProductDto } from "./list.product.dto";
import ProductInterface from '../../../domain/product/entity/product.interface';

export default class ListProductUseCase {
    private productRepository: ProductRepositoryInterface;

    constructor(productRepository: ProductRepositoryInterface) {
        this.productRepository = productRepository;
    }

    async execute(input: InputListProductDto): Promise<OutputListProductDto> {
        const listProducts = await this.productRepository.findAll();

        const outputMapper = new OutputMapper<ProductInterface, ProductDto>();
        outputMapper.mapperFunction = mapperFunction;

        const listProductOutput = outputMapper.inputListToMapperOutputList(listProducts)

        return {products: listProductOutput}

    }
}

const mapperFunction : MapperFunction<ProductInterface, ProductDto> = (product) => ({
        id: product.id,
        name: product.name,
        price: product.price
})