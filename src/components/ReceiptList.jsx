import ReceiptCard from "./ReceiptCard";
function ReceiptList({ receipts, onDelete, onUpdate }) {
return (
    
    <div className="flex flex-col gap-4 mt-6 max-w-[450px] w-full mx-auto px-2">
      {receipts.map((receipt) => (
        <ReceiptCard 
          key={receipt.id} 
          receipt={receipt} 
          onDelete={onDelete} 
          onUpdate={onUpdate} // <-- Предай го на ReceiptCard
        />
      ))}
    </div>
  );
}

export default ReceiptList;