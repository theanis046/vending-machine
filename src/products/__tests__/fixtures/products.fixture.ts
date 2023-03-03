import { Product } from "../../entities/product.entity";
import { User } from "../../../users/entities/user.entity";

const products = Promise.resolve([
    {
        id: 1,
        amountAvailable: 10,
        productName: 'Product1',
        user: new User()
    } as Product,
    {
        id: 2,
        amountAvailable: 10,
        productName: 'Product1',
        user: new User()
    } as Product
])
export default products

// id: number;

  
// @Column({ nullable: false })
// amountAvailable: number | 0;

// @Column()
// cost: number | 0;

// @Column()
// productName: string;


// @ManyToOne(() => User)
// user?: User | null;