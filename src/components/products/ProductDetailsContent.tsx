type Props = {
    label: string;
    value: string;
}

export default function ProductDetailsContent({label, value} : Props) {
    return (
        <div>
            <label className="block font-medium product-modif-content-mt">{label}</label>
            <textarea
                value={value}
                readOnly
                className="w-64 h-22 border border-gray-300 rounded product-modif-content-mt product-input"
            />
        </div>
    )
}