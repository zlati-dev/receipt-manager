import React, { useState } from "react";

function ReceiptCard({ receipt, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);
  // Локален стейт за снимката директно в картата
  const [cardImage, setCardImage] = useState(receipt.image || null);
const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onloadend = () => {
            const base64String = reader.result; // Това е твоята снимка като текст
            
            // 1. Записваме я в стейта, за да излезе на екрана веднага
            setCardImage(base64String); 
            
            // 2. Записваме я трайно в localStorage за тази конкретна карта
            const savedReceipts = JSON.parse(localStorage.getItem('receipts')) || [];
            const updatedReceipts = savedReceipts.map(r => {
                if (r.id === receipt.id) {
                    return { ...r, image: base64String }; // Добавяме снимката към обекта
                }
                return r;
            });
            
            localStorage.setItem('receipts', JSON.stringify(updatedReceipts));
        };
        
        reader.readAsDataURL(file);
    }
};
  const warrantyEnd = new Date(receipt.purchaseDate);
  warrantyEnd.setMonth(warrantyEnd.getMonth() + Number(receipt.warrantyMonths));
  const isUnderWarranty = new Date() < warrantyEnd;

  return (
    <div className="border-2 border-gray-200 p-4 rounded-xl bg-white shadow-sm mb-4">
      
      {/* МАЛКАТА КАРТА (Снимката е отстрани вдясно, ако я има) */}
      {!showDetails && (
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">{receipt.productName}</h3>
            <p className={`font-semibold text-sm ${isUnderWarranty ? "text-green-600" : "text-red-500"}`}>
              {isUnderWarranty ? "✅ In warranty" : "❌ Expired"}
            </p>
            <p className="text-sm text-gray-600 mt-1">Store: {receipt.store}</p>
            <p className="text-xs text-gray-400">S/N: {receipt.serialNumber}</p>
            
            {/* Ако няма снимка, показваме малкия бутон за добавяне отдолу */}
            {!cardImage && (
              <div className="mt-3">
                <label className="text-xs font-medium text-blue-600 cursor-pointer hover:underline">
                  ➕ Добави снимка
                  <input
                    type="file"
                    accept="image/*"
                  
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Снимката се показва малка отстрани вдясно */}
          {cardImage && (
            <img
              src={cardImage}
              onClick={() => setShowDetails(true)}
              className="w-20 h-20 object-cover rounded-lg cursor-pointer border hover:opacity-90 transition-opacity"
              alt="receipt preview"
            />
          )}
        </div>
      )}

      {/* МОДАЛ / ГОЛЯМАТА КАРТА (При цъкане на снимката) */}
      {showDetails && (
        <div className="flex flex-col gap-3 border-t-2 border-blue-500 pt-3 mt-1">
          <h3 className="text-xl font-bold text-gray-800">{receipt.productName}</h3>
          
          {cardImage && (
            <img
              src={cardImage}
              className="w-full max-h-[300px] object-contain rounded-lg border bg-gray-50"
              alt="full receipt"
            />
          )}

          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Store:</strong> {receipt.store}</p>
            <p><strong>Purchased:</strong> {receipt.purchaseDate}</p>
            <p><strong>Warranty:</strong> {receipt.warrantyMonths} months</p>
            <p><strong>Expires:</strong> {warrantyEnd.toLocaleDateString()}</p>
            <p className={`font-bold text-base ${isUnderWarranty ? "text-green-600" : "text-red-500"}`}>
              {isUnderWarranty ? "✅ IN WARRANTY" : "❌ WARRANTY EXPIRED"}
            </p>
            <p className="text-xs text-gray-500"><strong>Serial Number:</strong> {receipt.serialNumber}</p>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setShowDetails(false)}
              className="bg-gray-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-600"
            >
              Close
            </button>
            <button
              onClick={() => onDelete(receipt.id)}
              className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReceiptCard;