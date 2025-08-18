import ProductRef from './ProductRef';
import ProductDetails from './ProductDetails';
import ProductButton from './ProductButton';
import '@/styles/order.css';
import '@/styles/product.css';

export default function UpdateProductForm() {
    return (
        <div className='mts product-modif-form w-[80%]'>
            <h1 className="text-3xl font-bold">Modification produit</h1>
            <ProductRef />
            <ProductDetails />
            <ProductButton />
        </div>
    )
}