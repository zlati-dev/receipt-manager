import { useState } from "react";

function ReceiptCard({ receipt, onDelete, onUpdate }) {
  const [showDetails, setShowDetails] = useState(false);
  const [cardImage, setCardImage] = useState(receipt.image || null);

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

        // Обновяваме снимката правилно през onUpdate
        onUpdate({ ...receipt, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Правилно обновяване без директна мутация - това оправя белия екран в Netlify!
    onUpdate({
      ...receipt,
      ...editedData,
    });
    setIsEditing(false);
  };

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
            onClick={() => setShowDetails(true)} // Отваря големия модал
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
              style={{
                padding: "6px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              name="store"
              value={editedData.store}
              onChange={handleInputChange}
              style={{
                padding: "6px",
                fontSize: "13px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <div style={{ position: "relative", width: "100%" }}>
              <input
                type="date"
                name="purchaseDate"
                value={editedData.purchaseDate || ""} // Подсигуряваме срещу бял екран, ако е празно
                onChange={handleInputChange} // Твоята функция за промяна
                className={!editedData.purchaseDate ? "empty-card-date" : ""}
                style={{
                  padding: "6px",
                  fontSize: "13px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff", // Изрично БЯЛ фон
                  color: editedData.purchaseDate ? "#000" : "transparent", // Скрива дефолтния текст, ако няма дата
                  WebkitTextFillColor: editedData.purchaseDate
                    ? "#000"
                    : "transparent",
                  width: "100%",
                  boxSizing: "border-box",
                  display: "block",
                  lineHeight: "1.2",
                  appearance: "none",
                  WebkitAppearance: "none",
                }}
              />

              {/* Инжектираме стила, който скрива системните иконки на телефона и слага чист placeholder */}
              <style>{`
    /* 1. Скриваме вградените сиви стрелки и контроли на iOS и Android, за да не пречат */
    .empty-card-date::-webkit-calendar-picker-indicator,
    .empty-card-date::-webkit-inner-spin-button,
    .empty-card-date::-webkit-clear-button {
      background: transparent;
      color: transparent;
      opacity: 0;
      -webkit-appearance: none;
    }

    /* 2. Налагаме нашия чист текст "Purchase date" точно по средата */
    .empty-card-date::before {
      content: 'Purchase date';
      color: #999;
      position: absolute;
      left: 6px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      font-size: 13px;
      font-family: inherit;
    }
  `}</style>
            </div>
            <input
              type="number"
              name="warrantyMonths"
              value={editedData.warrantyMonths}
              onChange={handleInputChange}
              style={{
                padding: "6px",
                fontSize: "13px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              name="serialNumber"
              value={editedData.serialNumber}
              onChange={handleInputChange}
              style={{
                padding: "6px",
                fontSize: "13px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              placeholder="S/N"
            />
          </div>
        ) : (
          <>
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "18px",
                color: "#333",
                cursor: "pointer",
              }}
              onClick={() => setShowDetails(true)}
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

      {/* ИСТИНСКИ FULLSCREEN МОДАЛ (ИЗЛИЗА НАД ЦЕЛИЯ ЕКРАН) */}
      {showDetails && (
        <div
          style={{
            position: "fixed", // Заковава се над всичко
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.85)", // Тъмен фон, за да изпъкне бележката
            zIndex: 9999, // Най-отгоре
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "16px",
              maxWidth: "90%",
              maxHeight: "90%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            {cardImage && (
              <img
                src={cardImage}
                style={{
                  width: "100%",
                  maxHeight: "60vh",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
                alt="Full receipt"
              />
            )}
            <div
              style={{
                textAlign: "left",
                width: "100%",
                fontSize: "16px",
                color: "#333",
                lineHeight: "1.5",
              }}
            >
              <h2 style={{ marginTop: 0 }}>{editedData.productName}</h2>
              <p>
                <strong>Магазин:</strong> {editedData.store}
              </p>
              <p>
                <strong>Купено на:</strong>{" "}
                {new Date(editedData.purchaseDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Гаранция:</strong> {editedData.warrantyMonths} месеца
              </p>
              <p>
                <strong>Изтича на:</strong> {warrantyEnd.toLocaleDateString()}
              </p>
              <p>
                <strong>S/N:</strong> {editedData.serialNumber || "Няма"}
              </p>
            </div>
            <button
              onClick={() => setShowDetails(false)}
              style={{
                backgroundColor: "#333",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              Затвори
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReceiptCard;
