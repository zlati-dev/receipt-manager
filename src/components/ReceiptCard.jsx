import { useState } from "react";

function ReceiptCard({ receipt, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);
  const [cardImage, setCardImage] = useState(receipt.image || null);

  // Нови стейтове за режима на редактиране
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    productName: receipt.productName,
    store: receipt.store,
    purchaseDate: receipt.purchaseDate,
    warrantyMonths: receipt.warrantyMonths,
    serialNumber: receipt.serialNumber || "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setCardImage(base64String);

        const savedReceipts =
          JSON.parse(localStorage.getItem("receipts")) || [];
        const updatedReceipts = savedReceipts.map((r) => {
          if (r.id === receipt.id) {
            return { ...r, image: base64String };
          }
          return r;
        });
        localStorage.setItem("receipts", JSON.stringify(updatedReceipts));
      };
      reader.readAsDataURL(file);
    }
  };

  // Функция, която следи какво пишеш в полетата при редактиране
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  // Функция за запазване на редактираните данни
  const handleSave = () => {
    const savedReceipts = JSON.parse(localStorage.getItem("receipts")) || [];
    const updatedReceipts = savedReceipts.map((r) => {
      if (r.id === receipt.id) {
        // Обединяваме старите данни (като ID и снимка) с новите редактирани текстове
        return { ...r, ...editedData };
      }
      return r;
    });

    localStorage.setItem("receipts", JSON.stringify(updatedReceipts));
    setIsEditing(false);
    // За да се обнови веднага на екрана без F5, в реално приложение се ползва функция подадена от App.jsx,
    // но за нуждите на localStorage тук, следващия път като се зареди, данните ще са обновени.
    // За максимално бърз ефект на екрана, променяме локално и обекта receipt:
    receipt.productName = editedData.productName;
    receipt.store = editedData.store;
    receipt.purchaseDate = editedData.purchaseDate;
    receipt.warrantyMonths = editedData.warrantyMonths;
    receipt.serialNumber = editedData.serialNumber;
  };

  // Изчисляване на гаранцията въз основа на (може би променената) дата
  const warrantyEnd = new Date(editedData.purchaseDate);
  warrantyEnd.setMonth(
    warrantyEnd.getMonth() + Number(editedData.warrantyMonths),
  );
  const isUnderWarranty = new Date() < warrantyEnd;
  const statusColor = isUnderWarranty ? "#2e7d32" : "#d32f2f";

  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        alignItems: "start",
        marginBottom: "20px",
        backgroundColor: "#fff",
        padding: "15px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        position: "relative",
        borderLeft: `6px solid ${statusColor}`,
      }}
    >
      {/* СНИМКА ИЛИ ИНПУТ ЗА СНИМАНЕ */}
      <div style={{ width: "120px", flexShrink: 0 }}>
        {cardImage ? (
          <img
            src={cardImage}
            onClick={() => setShowDetails(!showDetails)}
            style={{
              cursor: "pointer",
              width: "100%",
              height: "120px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
            alt="receipt"
          />
        ) : (
          <div
            style={{
              border: "1px dashed #ccc",
              padding: "10px",
              borderRadius: "8px",
              textAlign: "center",
              backgroundColor: "#fcfcfc",
            }}
          >
            <label
              style={{
                fontSize: "11px",
                display: "block",
                marginBottom: "5px",
                color: "#666",
                fontWeight: "bold",
              }}
            >
              📷 ДОБАВИ СНИМКА
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ width: "100%", fontSize: "10px" }}
            />
          </div>
        )}
      </div>

      {/* ИНФОРМАЦИЯ НА КАРТАТА */}
      <div style={{ flexGrow: 1 }}>
        {isEditing ? (
          /* РЕЖИМ НА РЕДАКТИРАНЕ: ПОКАЗВАМЕ ПОЛЕТА ЗА ПИСАНЕ */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              marginBottom: "10px",
            }}
          >
            <input
              type="text"
              name="productName"
              value={editedData.productName}
              onChange={handleInputChange}
              style={{ padding: "4px", fontSize: "16px", fontWeight: "bold" }}
              placeholder="Име на продукт"
            />
            <input
              type="text"
              name="store"
              value={editedData.store}
              onChange={handleInputChange}
              style={{ padding: "4px", fontSize: "13px" }}
              placeholder="Магазин"
            />
            <input
              type="text" // Започва като текст, за да покаже placeholder-а
              placeholder="Purchase date"
              value={purchaseDate} // или както се казва стейтът ти тук (напр. newReceipt.purchaseDate)
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
              }}
              onChange={(e) => setPurchaseDate(e.target.value)} // промени го според твоята функция
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                backgroundColor: "#fff", // Изрично БЯЛ фон
                fontSize: "16px",
                color: "#333",
                width: "100%",
                boxSizing: "border-box",
                webkitAppearance: "none", // Маха сивия мобилен бъг за iOS
                appearance: "none", // Маха сивия мобилен бъг за Android
                minHeight: "45px", // Гарантира, че ще е висок колкото другите инпути
              }}
            />
            <input
              type="number"
              name="warrantyMonths"
              value={editedData.warrantyMonths}
              onChange={handleInputChange}
              style={{ padding: "4px", fontSize: "13px" }}
              placeholder="Месеци гаранция"
            />
            <input
              type="text"
              name="serialNumber"
              value={editedData.serialNumber}
              onChange={handleInputChange}
              style={{ padding: "4px", fontSize: "13px" }}
              placeholder="Сериен номер (S/N)"
            />
          </div>
        ) : (
          /* СТАНДАРТЕН РЕЖИМ: ПОКАЗВАМЕ ТЕКСТ */
          <>
            <h3
              style={{ margin: "0 0 8px 0", fontSize: "18px", color: "#333" }}
            >
              {editedData.productName}
            </h3>
            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>
              <strong>Магазин:</strong> {editedData.store}
            </p>
            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>
              <strong>Изтича на:</strong> {warrantyEnd.toLocaleDateString()}
            </p>
            <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#999" }}>
              S/N: {editedData.serialNumber || "Няма"}
            </p>
          </>
        )}

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span
            style={{
              color: statusColor,
              fontWeight: "bold",
              fontSize: "13px",
              backgroundColor: isUnderWarranty ? "#e8f5e9" : "#ffebee",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            {isUnderWarranty ? "In warranty" : "Expired"}
          </span>

          {/* БУТОН ЗА РЕДАКТИРАНЕ / ЗАПАЗВАНЕ */}
          {isEditing ? (
            <button
              onClick={handleSave}
              style={{
                backgroundColor: "#2e7d32",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "bold",
                padding: "4px 10px",
              }}
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                backgroundColor: "transparent",
                color: "#0066cc",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "bold",
                padding: "4px 8px",
              }}
            >
              Edit
            </button>
          )}

          {/* БУТОН ЗА ИЗТРИВАНЕ */}
          <button
            onClick={() => onDelete(receipt.id)}
            style={{
              backgroundColor: "transparent",
              color: "#d32f2f",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "bold",
              padding: "4px 8px",
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* ДЕТАЙЛИ / МОДАЛ ПРИ КЛИКВАНЕ НА СНИМКАТА */}
      {showDetails && (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255,255,255,0.95)",
            borderRadius: "12px",
            padding: "15px",
            boxSizing: "border-box",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p style={{ margin: "2px 0" }}>
            <strong>Купено на:</strong> {editedData.purchaseDate}
          </p>
          <p style={{ margin: "2px 0" }}>
            <strong>Гаранция:</strong> {editedData.warrantyMonths} месеца
          </p>
          <button
            onClick={() => setShowDetails(false)}
            style={{
              marginTop: "10px",
              alignSelf: "start",
              padding: "4px 12px",
            }}
          >
            Затвори детайли
          </button>
        </div>
      )}
    </div>
  );
}

export default ReceiptCard;
