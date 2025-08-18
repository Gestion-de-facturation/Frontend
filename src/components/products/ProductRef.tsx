type Props = {
    reference: string;
}

export default function ProductRef({ reference }: Props) {
    return (
        <div className='border border-[#cccccc] mts rounded-md product-modif-container'>
            <h2 className='text-xl font-bold'>Référence du produit</h2>
            <div className='border border-[#cccccc] w-52 rounded product-reference-container product-modif-content-mt '>
                <span className='font-semibold'>Ref: </span>
                <span>{reference}</span>
            </div>
        </div>
    )
}