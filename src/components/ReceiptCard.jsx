import { useState } from 'react'

function ReceiptCard({ receipt, onDelete }) {
    const [showDetails, setShowDetails] = useState(false)
    const [cardImage, setCardImage] = useState(receipt.image || null)
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setCardImage(base64String); 
                
                const savedReceipts = JSON.parse(localStorage.getItem('receipts')) || [];
                const updatedReceipts = savedReceipts.map(r => {
                    if (r.id === receipt.id) {
                        return { ...r, image: base64String };
                    }
                    return r;
                });
                localStorage.setItem('receipts', JSON.stringify(updatedReceipts));
            };
            reader.readAsDataURL(file);
        }
    };

    const warrantyEnd = new Date(receipt.purchaseDate)
    warrantyEnd.setMonth(warrantyEnd.getMonth() + Number(receipt.warrantyMonths))
    const isUnderWarranty = new Date() < warrantyEnd

    // Цвят за страничната линия тип Jira (Зелено за валидна, Червено за изтекла)
    const statusColor = isUnderWarranty ? '#2e7d32' : '#d32f2f'

    return (
        <div style={{ 
            display: 'flex', 
            gap: '15px', 
            alignItems: 'start', 
            marginBottom: '20px',
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            position: 'relative',
            // СТРАНИЧНОТО ОЦВЕТЯВАНЕ ТИП JIRA:
            borderLeft: `6px solid ${statusColor}` 
        }}>
            
           {/* СНИМКА ИЛИ ИНПУТ ЗА СНИМАНЕ (ОТСТРАНИ) */}
<div style={{ width: '120px', flexShrink: 0 }}>
    {cardImage ? (
        <img 
            src={cardImage}
            onClick={() => setShowDetails(!showDetails)}
            style={{ 
                cursor: 'pointer',
                width: '100%',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '8px'
            }}
            alt="receipt"
        />
    ) : (
        <div style={{ 
            border: '1px dashed #ccc', 
            padding: '10px', 
            borderRadius: '8px',
            textAlign: 'center',
            backgroundColor: '#fcfcfc'
        }}>
            <label style={{ fontSize: '11px', display: 'block', marginBottom: '5px', color: '#666', fontWeight: 'bold' }}>
                📷 ДОБАВИ СНИМКА
            </label>
            <input 
                type="file" 
                accept="image/*" // <-- ОСТАВЯМЕ САМО ТОВА (БЕЗ capture)
                onChange={handleFileChange}
                style={{ width: '100%', fontSize: '10px' }}
            />
        </div>
    )}
</div>
            
            {/* ИНФОРМАЦИЯ НА КАРТАТА */}
            <div style={{ flexGrow: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#333' }}>
                    {receipt.productName}
                </h3>
                
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>
                    <strong>Магазин:</strong> {receipt.store}
                </p>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>
                    <strong>Изтича на:</strong> {warrantyEnd.toLocaleDateString()}
                </p>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#999' }}>
                    S/N: {receipt.serialNumber || 'Няма'}
                </p>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{
                        color: statusColor,
                        fontWeight: 'bold',
                        fontSize: '13px',
                        backgroundColor: isUnderWarranty ? '#e8f5e9' : '#ffebee',
                        padding: '4px 8px',
                        borderRadius: '4px'
                    }}>
                        {isUnderWarranty ? 'In warranty' : 'Expired'}
                    </span>

                    {/* БУТОН ЗА ИЗТРИВАНЕ ДИРЕКТНО НА КАРТАТА */}
                    <button 
                        onClick={() => onDelete(receipt.id)}
                        style={{ 
                            backgroundColor: 'transparent',
                            color: '#d32f2f', 
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            padding: '4px 8px'
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* МОДАЛ / ДЕТАЙЛИ ПРИ ЗАКЛИКВАНЕ НА СНИМКАТА */}
            {showDetails && (
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderRadius: '12px',
                    padding: '15px',
                    boxSizing: 'border-box',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <p style={{ margin: '2px 0' }}><strong>Купено на:</strong> {receipt.purchaseDate}</p>
                    <p style={{ margin: '2px 0' }}><strong>Гаранция:</strong> {receipt.warrantyMonths} месеца</p>
                    <button 
                        onClick={() => setShowDetails(false)}
                        style={{ marginTop: '10px', alignSelf: 'start', padding: '4px 12px' }}
                    >
                        Затвори детайли
                    </button>
                </div>
            )}
        </div>
    )
}

export default ReceiptCard