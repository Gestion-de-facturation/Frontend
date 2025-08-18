import ProductDetailsContent from "./ProductDetailsContent"

export default function ProductDetails() {
    return (
        <div className='border border-[#cccccc] mts rounded-md product-modif-container'>
            <h2 className="text-xl font-bold">Détails du produit</h2>
            <div className="flex justify-between">
                <ProductDetailsContent label="Nom du produit" value="produit 1 | exemple" />
                <ProductDetailsContent label="Catégorie" value="catégorie 1 | exemple" />
                <ProductDetailsContent label="Fournisseur" value="fournisseur 1 | exemple" />
            </div>
            <div>
                <label className="block font-medium product-modif-content-mt">Prix unitaire</label>
                <input 
                type="text" 
                value="20000 Ar" 
                className="w-64 border border-gray-300 rounded product-modif-content-mt product-input"
                readOnly/>
            </div>
            <div className="flex">
                
            </div>
        </div>
    )
}