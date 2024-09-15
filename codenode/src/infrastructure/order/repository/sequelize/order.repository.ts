import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        
        await OrderModel.create( {
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity
            }))
        },
            {
                include: [{model: OrderItemModel}],
            });
    }


    async update(entity: Order): Promise<void> {

        const sequelize = OrderModel.sequelize;
        
        await sequelize.transaction( async (t) => {
            await OrderModel.update({
                customer_id: entity.customerId,
                total: entity.total()
            },
            {
                where: {
                    id: entity.id
                },
                transaction: t
            });

            await OrderItemModel.destroy({
                where: { order_id: entity.id },
                transaction: t
            });

            await OrderItemModel.bulkCreate(
                entity.items.map((item) => ({
                    id: item.id,
                    order_id: entity.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity
                })),
                {
                    transaction: t
                }
            )
        });

    }

    async find(id: string): Promise<Order> {

        let orderModel;

        try {
            orderModel = await OrderModel.findOne({
                where: {
                    id
                },
                include: ["items"],
                rejectOnEmpty: true
            });
        } catch(error) {
            throw new Error("Order not found");
        }
        
        const orderItems = orderModel.items.map((item) => new OrderItem(item.id, item.product_id, item.name, item.price, item.quantity));

        const order = new Order(id, orderModel.customer_id, orderItems);

        return order;
        
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll( {include: ["items"]});

        let orders: Order[] = [];

        orderModels.forEach((order) => {
            let items: OrderItem[] = [];
            order.items.forEach((item) => {
                items.push(new OrderItem(item.id, item.product_id, item.name,item.price,item.quantity))
            });
            orders.push(new Order(order.id, order.customer_id, items));
        })
        return orders;
    }

}0