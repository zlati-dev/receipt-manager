import { useState, useEffect } from "react";
import ReceiptFrom from "./components/ReceiptsFrom"; 
import ReceiptList from "./components/ReceiptList";
import FilterBar from "./components/FilterBar";

function App() {
  // Zarjdane na belejkite ot LocalStorage
  const [receipts, setReceipts] = useState(() => {
    const saved = localStorage.getItem("receipts");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [search, setSearch] = useState("");
  const [filterStore, setFilterStore] = useState("");

  // sinhronizirane s LocalStorage pri promena na receipts
  useEffect(() => {
    localStorage.setItem("receipts", JSON.stringify(receipts));

  }, [receipts]);

  // Nova belejka se dobavq kum spisaka
  const addReceipt = (newReceipt) => {
    setReceipts([...receipts, newReceipt]);
  };

  // iztrivane na belejka po ID
  const deleteReceipt = (id) => {
    setReceipts(receipts.filter((r) => r.id !== id));
  };

  // flitrirane na belejkite 
  const filtered = receipts
    .filter((r) => r.productName.toLowerCase().includes(search.toLowerCase()))
    .filter(
      (r) =>
        filterStore === "" ||
        r.store.toLowerCase().includes(filterStore.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      
      <h1 className="text-center text-3xl font-bold text-gray-900 mb-6">
        Receipt Manager
      </h1>

      
      <ReceiptFrom onAdd={addReceipt} />

      {/* filtri */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        filterStore={filterStore}
        setFilterStore={setFilterStore}
      />

      {/* spisak belejki*/}
      <ReceiptList receipts={filtered} onDelete={deleteReceipt} />
    </div>
  );
}

export default App;