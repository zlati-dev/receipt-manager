import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";

function ReceiptForm({ onAdd, onScan, onScanImage, clearScan }) {
  const [store, setStore] = useState("");
  const [productName, setProductName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyMonths, setWarrantyMonths] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

useEffect(() => {
  if (onScan && typeof onScan === 'string' && onScan.trim() !== '') {
    
    setProductName(onScan);

    
    if (onScan.toLowerCase().includes('lidl')) {
      setStore('Lidl');
    } else if (onScan.toLowerCase().includes('kaufland')) {
      setStore('Kaufland');
    }
  }
}, [onScan]);
  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      id: Date.now(),
      store,
      productName,
      purchaseDate,
      warrantyMonths: Number(warrantyMonths),
      serialNumber,
    });
    setStore("");
    setProductName("");
    setPurchaseDate("");
    setWarrantyMonths("");
    setSerialNumber("");
    if (clearScan) {
      clearScan();
    }
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
          Scan receipt (photo):
        </label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => {
            if (e.target.files[0]) {
              onScanImage(e.target.files[0]);
            }
          }}
          className="border p-2 rounded-lg text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2.5 px-4 border-none rounded-lg cursor-pointer text-base font-semibold transition-colors duration-300 hover:bg-blue-700"
      >
        Add Receipt
      </button>
    </form>
  );
}

export default ReceiptForm;