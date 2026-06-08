import React from "react";

function ReceiptCard({ receipt, onDelete }) {
  const warrantyEnd = new Date(receipt.purchaseDate);
  warrantyEnd.setMonth(warrantyEnd.getMonth() + Number(receipt.warrantyMonths));
  const isUnderWarranty = new Date() < warrantyEnd;

  const borderColorClass = isUnderWarranty ? 'border-l-green-500' : 'border-l-red-500';
  const statusColorClass = isUnderWarranty ? 'text-green-600' : 'text-red-500';

  return (
    <div className={`bg-white p-5 rounded-xl shadow-sm border-l-8 ${borderColorClass} mb-4 text-left max-w-[450px] w-full mx-auto transition-all hover:shadow-md`}>
      
      {/* Snimka na kasoviyat bon ako ima kachena */}
      {receipt.image && (
        <div className="mb-4 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
          <img 
            src={receipt.image} 
            alt="Receipt proof" 
            className="w-full h-40 object-cover hover:object-contain transition-all duration-300 cursor-pointer"
            onClick={() => window.open(receipt.image, '_blank')} // Otvarya snimkata v nov tab pri klik v golyam razmer
            title="Click to view full image"
          />
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="m-0 text-lg font-semibold text-gray-900 break-words max-w-[70%]">
          {receipt.productName}
        </h2>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isUnderWarranty ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {isUnderWarranty ? 'In warranty' : 'Expired'}
        </span>
      </div>
      
      <p className="text-gray-500 text-sm mt-1.5 mb-0 font-medium">
        {receipt.store} · {receipt.purchaseDate}
      </p>

      <p className="text-gray-400 text-sm mt-1 mb-0">
        Expires: {warrantyEnd.toLocaleDateString()}
      </p>

      
      {receipt.serialNumber && (
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-gray-400 font-medium tracking-wider uppercase">Device Status</span>
          <div className="flex items-center space-x-1.5">
           
            <span className={`w-2 h-2 rounded-full animate-pulse ${isUnderWarranty ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <code className="font-mono bg-gray-50 text-gray-700 px-2 py-0.5 rounded uppercase font-bold text-[11px] border border-gray-100">
              {receipt.serialNumber}
            </code>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-3 pt-1">
        <button 
          onClick={() => onDelete(receipt.id)} 
          className="text-gray-400 bg-transparent border-none cursor-pointer text-sm p-0 hover:text-red-500 transition-colors duration-200 font-medium"
        >
          Delete 
        </button>
      </div>
    </div>
  );
}

export default ReceiptCard;