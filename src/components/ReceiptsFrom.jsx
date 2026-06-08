import React, { useState } from "react";

function ReceiptsForm({ onAdd }) {
  const [store, setStore] = useState("");
  const [productName, setProductName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyMonths, setWarrantyMonths] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [receiptImage, setReceiptImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Podavame dannnite gore v funkciyata onAdd, vklyuchitelno i snimkata
    onAdd({
      id: Date.now(),
      store,
      productName,
      purchaseDate,
      warrantyMonths: Number(warrantyMonths),
      serialNumber,
      image: receiptImage, // Dobavqme snimkata kum obekta na belejkata
    });

    // izchistvame formata sled dobavqneto
    setStore("");
    setProductName("");
    setPurchaseDate("");
    setWarrantyMonths("");
    setSerialNumber("");
    setReceiptImage(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-[450px] w-full mx-auto p-4 md:p-6 bg-white rounded-xl shadow-md"
    >
      <input
        value={store}
        onChange={(e) => setStore(e.target.value)}
        placeholder="Store (Lidl, Kaufland...)"
        className="border p-2 rounded-lg focus:outline-none focus:border-blue-500"
      />

      <input
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Product name"
        className="border p-2 rounded-lg focus:outline-none focus:border-blue-500"
      />

      <input
        type="number"
        value={warrantyMonths}
        onChange={(e) => setWarrantyMonths(e.target.value)}
        placeholder="Warranty months (e.g. 24)"
        className="border p-2 rounded-lg focus:outline-none focus:border-blue-500"
      />

      <input
        type="date"
        value={purchaseDate}
        onChange={(e) => setPurchaseDate(e.target.value)}
        className="border p-2 rounded-lg focus:outline-none focus:border-blue-500"
      />

      <input
        value={serialNumber}
        onChange={(e) => setSerialNumber(e.target.value)}
        placeholder="Serial number"
        className="border p-2 rounded-lg focus:outline-none focus:border-blue-500"
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">
          Add receipt photo (for proof):
        </label>
        <input
  type="file"
  accept="image/*"
  capture="environment"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      
      // Kogato cheteneto na faila e gotovo, zapazvame snimkata v state-a (Base64 format)
      reader.onloadend = () => {
        // reader pazi snimkata (Base64)
        setReceiptImage(reader.result); 
      };
      
      // Zapochvame chetene na faila kato Base64 string
      reader.readAsDataURL(file);
    }
  }}
  className="border p-2 rounded-lg text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
/>
      </div>

      {receiptImage && (
        <div className="mt-2 text-xs text-green-600 flex items-center gap-1 font-medium">
          <span>✓ Photo uploaded successfully!</span>
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white py-2.5 px-4 border-none rounded-lg cursor-pointer text-base font-semibold transition-colors duration-300 hover:bg-blue-700"
      >
        Add Receipt
      </button>
    </form>
  );
}

export default ReceiptsForm;