import { useState, useEffect } from "react";
import ReceiptForm from "./components/ReceiptsFrom";
import ReceiptList from "./components/ReceiptList";
import FilterBar from "./components/FilterBar";
import Tesseract from "tesseract.js";

function App() {
  const [receipts, setReceipts] = useState(() => {
    const saved = localStorage.getItem("receipts");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  useEffect(() => {
    localStorage.setItem("receipts", JSON.stringify(receipts));
  }, [receipts]);

  const [filterStore, setFilterStore] = useState("");

  const addReceipt = (newReceipt) => {
    setReceipts([...receipts, newReceipt]);
  };

  const filtered = receipts
    .filter((r) => r.productName.toLowerCase().includes(search.toLowerCase()))
    .filter(
      (r) =>
        filterStore === "" ||
        r.store.toLowerCase().includes(filterStore.toLowerCase()),
    );

  const deleteReceipt = (id) => {
    setReceipts(receipts.filter((r) => r.id !== id));
  };
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [scannedText, setScannedText] = useState("");
  const handleImageChange = async (imagefile) => {
    setIsLoading(true);
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(imagefile, "bul+eng", {
        workerOptions: {
          load_system_program: [["provide", "version"]],
        },
        workerPath: 'https://unpkg.com/tesseract.js@v5.1.0/dist/tesseract-worker.min.js',
        langPath: 'https://cdn.jsdelivr.net/npm/@trevorblades/tessdata@1.0.3/',
        corePath: 'https://unpkg.com/tesseract.js-core@v5.1.0/tesseract-core.wasm.js',
        logger: (m) => console.log(m), 
      });

      console.log("OCR Result:", text);

      setOcrText(text);
      setScannedText(text);
    } catch (error) {
      console.error("Error scanning receipt:", error);
      alert(`Reading the receipt failed. Please try again with a clearer image or better lighting. Error details: ${error.message}`);
    }
    setIsLoading(false);
  };

  return (
    
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      
     
      <h1 className="text-center text-3xl font-bold text-gray-900 mb-6">
        Receipt Manager
      </h1>

      <ReceiptForm
        onAdd={addReceipt}
        onScan={scannedText}
        onScanImage={handleImageChange}
        clearScan={() => setScannedText("")}
      />

      
      {isLoading && (
        <div className="text-center my-5 text-blue-600 font-bold animate-pulse">
          Scanning receipt...
        </div>
      )}

      
      {scannedText && (
        <div className="max-w-[450px] w-100 mx-auto my-5 p-4 bg-gray-100 rounded-lg text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
          
         
          <h3 className="text-base font-semibold mb-2">
            Scanned Receipt Text:
          </h3>
          
          
          <pre className="whitespace-pre-wrap break-words text-sm font-mono text-gray-700">
            {scannedText}
          </pre>
        </div>
      )}
      
      <FilterBar
        search={search}
        setSearch={setSearch}
        filterStore={filterStore}
        setFilterStore={setFilterStore}
      />

      <ReceiptList receipts={filtered} onDelete={deleteReceipt} />
    </div>
  );
}

export default App;