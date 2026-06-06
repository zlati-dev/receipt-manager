function ReceiptCard({ receipt, onDelete }) {
  const warrantyEnd = new Date(receipt.purchaseDate)
  warrantyEnd.setMonth(warrantyEnd.getMonth()+ Number(receipt.warrantyMonths))
  const isUnderWarranty = new Date() < warrantyEnd
 
 
  const borderColorClass = isUnderWarranty ? 'border-l-green-500' : 'border-l-red-500';
  const statusColorClass = isUnderWarranty ? 'text-green-600' : 'text-red-500';

  return (
    <div className={`bg-white p-5 rounded-xl shadow-sm border-l-8 ${borderColorClass} mb-4 text-left max-w-[450px] w-full mx-auto`}>
      
      <div className="flex justify-between items-center">
        <h2 className="m-0 text-lg font-semibold text-gray-900 break-words max-w-[70%]">
          {receipt.productName}
        </h2>
        <span className={`text-xs font-medium ml-auto ${statusColorClass}`}>
          {isUnderWarranty ? 'In warranty' : 'Expired'}
        </span>
      </div>
      
      <p className="text-gray-500 text-sm mt-1.5 mb-0">
        {receipt.store} · {receipt.purchaseDate}
      </p>

      <p className="text-gray-400 text-sm mt-1 mb-0">{receipt.productName}</p>
      <p className="text-gray-400 text-sm mt-1 mb-0">Serial: {receipt.serialNumber}</p>

      <p className="text-gray-400 text-sm mt-1 mb-0">
        Expires: {warrantyEnd.toLocaleDateString()}
      </p>
      
      <button 
        onClick={() => onDelete(receipt.id)} 
        className="mt-3 text-gray-400 bg-transparent border-none cursor-pointer text-sm p-0 hover:text-red-500 transition-colors duration-200"
      >
        Delete
      </button>
    </div>
  );
}

export default ReceiptCard;