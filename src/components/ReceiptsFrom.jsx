import React, { useState } from "react";

function ReceiptsForm({ onAdd }) {
  const [store, setStore] = useState("");
  const [productName, setProductName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyMonths, setWarrantyMonths] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Подаваме само текстовите полета нагоре
    onAdd({
      id: Date.now(),
      store,
      productName,
      purchaseDate,
      warrantyMonths: Number(warrantyMonths),
      serialNumber,
    });

    // Изчистваме формата
    setStore("");
    setProductName("");
    setPurchaseDate("");
    setWarrantyMonths("");
    setSerialNumber("");
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
        type="text"
        placeholder="Purchase date (e.g.YYYY-MM-DD )" // Подсказваме формата на датата
        value={purchaseDate}
        onChange={(e) => setPurchaseDate(e.target.value)}
        className="border p-2 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-black w-full"
        style={{
          backgroundColor: "#fff", // Изрично подсигуряване за бяло
          color: "#000",
          webkitAppearance: "none",
          appearance: "none",
        }}
      />

      <input
        value={serialNumber}
        onChange={(e) => setSerialNumber(e.target.value)}
        placeholder="Serial number"
        className="border p-2 rounded-lg focus:outline-none focus:border-blue-500"
      />

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
