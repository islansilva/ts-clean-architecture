import ProductRepository from '../../product/repository/sequelize/product.repository';
import {app, sequelize} from '../express';
import request from 'supertest';



describe("E2T test for product", () => {

    beforeEach(async() => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    })

    it("should create a product", async() => {
    
        const inputCreate = {
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

        const responseCreate = await request(app)
            .post("/products")
            .send(inputCreate)
        
        expect(responseCreate.status).toBe(200);
        expect(responseCreate.body).toEqual(output)

    })


    it("should throw an error 500 when creating a product without name", async() => {
        const inputCreate = {
            type: "a",
            name: "",
            price: 100
        }

        const response = await request(app)
            .post("/products")
            .send(inputCreate)
        
        expect(response.status).toBe(500);
    })


    it("should throw an error 500 when creating a product with a value less than negative", async() => {
        
        const inputCreatePriceNegative = {
            type: "a",
            name: "Product A",
            price: -2
        }

        const responseCreatePriceNegative = await request(app)
            .post("/products")
            .send(inputCreatePriceNegative)
        
        expect(responseCreatePriceNegative.status).toBe(500);
    })


    it("should update a product", async() => {
        const inputCreate = {
            type: "a",
            name: "Product",
            price: 100
        }

        const responseCreate = await request(app)
            .post("/products")
            .send(inputCreate)
        
        expect(responseCreate.status).toBe(200);

        const InputUpdate = {
            id: responseCreate.body.id,
            name: "New Product",
            price: 300
        }

        const responseUpdate = await request(app)
            .put("/products")
            .send(InputUpdate)

            expect(responseUpdate.status).toBe(200);
            expect(responseUpdate.body).toEqual(
                {
                    id: responseCreate.body.id,
                    name: "New Product",
                    price: 300
                }
            )

    })


    it("should throw an error 500 when updating a product with a value less than  negative", async() => {
        const inputCreate = {
            type: "a",
            name: "Product",
            price: 100
        }

        const responseCreate = await request(app)
            .post("/products")
            .send(inputCreate)
        
        expect(responseCreate.status).toBe(200);

        const InputNegative = {
            id: responseCreate.body.id,
            name: "New Product",
            price: -300
        }

        const responseUpdateNegative = await request(app)
            .put("/products")
            .send(InputNegative)

            expect(responseUpdateNegative.status).toBe(500);
    })


    it("should list a product", async() => {
        const input = {
            type: "a",
            name: "Product",
            price: 100
        }

        const response = await request(app)
            .post("/products")
            .send(input)
        
        expect(response.status).toBe(200);

        const responseFind = await request(app)
            .get(`/products/${response.body.id}`)


            const output = {
                id: responseFind.body.id,
                name: "Product",
                price: 100
            }
        
        expect(responseFind.status).toBe(200);
        expect(responseFind.body).toEqual(output);


    })


    it("should not list a product", async() => {
        const input = {
            type: "a",
            name: "Product",
            price: 100
        }

        const response = await request(app)
            .post("/products")
            .send(input)
        
        expect(response.status).toBe(200);

        const responseFind = await request(app)
            .get(`/products/0001`)

        expect(responseFind.status).toBe(500);
    })


    it("should list all products", async() => {


        const inputProduct1 = {
            type: "a",
            name: "Product A",
            price: 100
        }

        const responseProduct1 = await request(app)
            .post("/products")
            .send(inputProduct1)
        
        expect(responseProduct1.status).toBe(200);

        const responseProduct2 = {
            type: "b",
            name: "Product B",
            price: 200
        }

        const response = await request(app)
            .post("/products")
            .send(responseProduct2)
        
        expect(response.status).toBe(200);

        const output = 
            {
            products:
                [{
                    id: expect.any(String),
                    name: "Product A",
                    price: 100,
                },
                {
                    id: expect.any(String),
                    name: "Product B",
                    price: 400, //Factory ProductB return value * 2
                }]
            }
        
        const listResponseProducts = await request(app)
            .get("/products")
        
        expect(listResponseProducts.status).toBe(200);
        expect(listResponseProducts.body.products.length).toBe(2);
        expect(listResponseProducts.body).toEqual(output);

    })
})