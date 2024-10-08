import {app, sequelize} from '../express';
import request from 'supertest';


describe("E2E test for customer", () => {


    beforeEach(async() => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    })

    it("should create a customer", async() => {
        const response = await request(app)
            .post("/customers")
            .send({
                name: "John",
                address: {
                    street: "Street",
                    city: "City",
                    number: 123,
                    zip: "12345"
                } 
            })

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("John");
        expect(response.body.address.street).toBe("Street");
        expect(response.body.address.city).toBe("City");
        expect(response.body.address.number).toBe(123);
        expect(response.body.address.zip).toBe("12345");
    })

    it("should not create a customer", async() => {
        const response = await request(app)
            .post("/customers")
            .send({
                name: "John",
            })

        expect(response.status).toBe(500);
    });

    it("should list all customer", async() => {

        const response = await request(app)
            .post("/customers")
            .send({
                name: "John",
                address: {
                    street: "Street",
                    city: "City",
                    number: 123,
                    zip: "12345"
                } 
            })
        expect(response.status).toBe(200);

        const response2 = await request(app)
            .post("/customers")
            .send({
                name: "Jane",
                address: {
                    street: "Street 2",
                    city: "City 2",
                    number: 456,
                    zip: "54321"
                } 
            })
        expect(response2.status).toBe(200);

        const listResponse = await request(app).get("/customers").send();
        expect(listResponse.status).toBe(200);
        expect(listResponse.body.customers.length).toBe(2);

        const customer = listResponse.body.customers[0];
        expect(customer.name).toBe("John");
        expect(customer.address.street).toBe("Street");
        expect(customer.address.city).toBe("City");
        expect(customer.address.number).toBe(123);
        expect(customer.address.zip).toBe("12345");

        const customer2 = listResponse.body.customers[1];
        expect(customer2.name).toBe("Jane");
        expect(customer2.address.street).toBe("Street 2");
        expect(customer2.address.city).toBe("City 2");
        expect(customer2.address.number).toBe(456);
        expect(customer2.address.zip).toBe("54321");

        const listResponseXML = await request(app)
        .get("/customers")
        .set("Accept", "application/xml")
        .send();

        expect(listResponseXML.status).toBe(200);
        expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
        expect(listResponseXML.text).toContain(`<customers>`);
        expect(listResponseXML.text).toContain(`</customers>`);
        expect(listResponseXML.text).toContain(`<name>John</name>`);
        expect(listResponseXML.text).toContain(`<name>Jane</name>`);
        expect(listResponseXML.text).toContain(`<address>`);
        expect(listResponseXML.text).toContain(`</address>`);
        expect(listResponseXML.text).toContain(`<street>Street</street>`);
        expect(listResponseXML.text).toContain(`<street>Street 2</street>`);
        

    })

});