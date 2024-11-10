import React, { useState } from 'react';
import { Button } from './components/button';
import { Input } from './components/input';

const Invoice = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    description: '',
    quantity: '',
    basePrice: ''
  });

  // Add validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [sender, setSender] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });
  const [receiver, setReceiver] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });

  const validateField = (name, value) => {
    switch(name) {
      case 'invoiceNumber':
        return !value ? 'Le numéro de facture est requis' : '';
      case 'invoiceDate':
        return !value ? 'La date est requise' : '';
      case 'sender.name':
        return !value ? 'Le nom est requis' : '';
      case 'sender.address':
        return !value ? 'L\'adresse est requise' : '';
      case 'sender.phone':
        return !value ? 'Le téléphone est requis' : '';
      case 'receiver.name':
        return !value ? 'Le nom est requis' : '';
      default:
        return '';
    }
  };

  const handleBlur = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handlePrint = () => {
    // Validate all required fields before printing
    const newErrors = {
      invoiceNumber: validateField('invoiceNumber', invoiceNumber),
      invoiceDate: validateField('invoiceDate', invoiceDate),
      'sender.name': validateField('sender.name', sender.name),
      'sender.address': validateField('sender.address', sender.address),
      'sender.phone': validateField('sender.phone', sender.phone),
      'receiver.name': validateField('receiver.name', receiver.name),
    };

    setErrors(newErrors);
    setTouched({
      invoiceNumber: true,
      invoiceDate: true,
      'sender.name': true,
      'sender.address': true,
      'sender.phone': true,
      'receiver.name': true,
    });

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error)) {
      alert('Veuillez remplir tous les champs requis avant d\'imprimer');
      return;
    }

    window.print();
  };

  const handleAddItem = () => {
    if (newItem.description && newItem.quantity && newItem.basePrice) {
      setItems([...items, {
        ...newItem,
        totalPrice: Number(newItem.quantity) * Number(newItem.basePrice)
      }]);
      setNewItem({ description: '', quantity: '', basePrice: '' });
    }
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tvq = subtotal * 0.09975;
  const tps = subtotal * 0.05;
  const total = subtotal + tvq + tps;

  const inputStyle = (field) => {
    return touched[field] && errors[field] ? 'border-red-500' : '';
  };

  const ErrorMessage = ({ field }) => {
    if (touched[field] && errors[field]) {
      return <div className="text-red-500 text-xs mt-1">{errors[field]}</div>;
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      {/* Print Button */}
      <div className="flex justify-end mb-4 print:hidden">
        <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
          🖨️ Imprimer
        </Button>
      </div>

      {/* Invoice Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">FACTURE</h1>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            Date: 
            <div className="flex flex-col">
              <Input 
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                onBlur={() => handleBlur('invoiceDate', invoiceDate)}
                className={`w-40 ${inputStyle('invoiceDate')}`}
              />
              <ErrorMessage field="invoiceDate" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            № de facture: 
            <div className="flex flex-col">
              <Input 
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                onBlur={() => handleBlur('invoiceNumber', invoiceNumber)}
                className={`w-32 ${inputStyle('invoiceNumber')}`}
              />
              <ErrorMessage field="invoiceNumber" />
            </div>
          </div>
        </div>
      </div>

      {/* Sender & Receiver Info */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <div className="h-6 mb-1"></div>
          <div className="mb-1">
            <Input
              placeholder="Nom *"
              value={sender.name}
              onChange={(e) => setSender({...sender, name: e.target.value})}
              onBlur={() => handleBlur('sender.name', sender.name)}
              className={`py-1 ${inputStyle('sender.name')}`}
            />
            <ErrorMessage field="sender.name" />
          </div>
          <div className="mb-1">
            <Input
              placeholder="Adresse *"
              value={sender.address}
              onChange={(e) => setSender({...sender, address: e.target.value})}
              onBlur={() => handleBlur('sender.address', sender.address)}
              className={`py-1 ${inputStyle('sender.address')}`}
            />
            <ErrorMessage field="sender.address" />
          </div>
          <div className="mb-1">
            <Input
              placeholder="Téléphone *"
              value={sender.phone}
              onChange={(e) => setSender({...sender, phone: e.target.value})}
              onBlur={() => handleBlur('sender.phone', sender.phone)}
              className={`py-1 ${inputStyle('sender.phone')}`}
            />
            <ErrorMessage field="sender.phone" />
          </div>
          <Input
            placeholder="Courriel"
            className="py-1"
            value={sender.email}
            onChange={(e) => setSender({...sender, email: e.target.value})}
          />
        </div>
        <div>
          <h2 className="font-bold mb-1 h-6">Facturé à:</h2>
          <div className="mb-1">
            <Input
              placeholder="Nom *"
              value={receiver.name}
              onChange={(e) => setReceiver({...receiver, name: e.target.value})}
              onBlur={() => handleBlur('receiver.name', receiver.name)}
              className={`py-1 ${inputStyle('receiver.name')}`}
            />
            <ErrorMessage field="receiver.name" />
          </div>
          <Input
            placeholder="Adresse"
            className="mb-1 py-1"
            value={receiver.address}
            onChange={(e) => setReceiver({...receiver, address: e.target.value})}
          />
          <Input
            placeholder="Téléphone"
            className="mb-1 py-1"
            value={receiver.phone}
            onChange={(e) => setReceiver({...receiver, phone: e.target.value})}
          />
          <Input
            placeholder="Courriel"
            className="py-1"
            value={receiver.email}
            onChange={(e) => setReceiver({...receiver, email: e.target.value})}
          />
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Description</th>
            <th className="text-right p-2">Quantité</th>
            <th className="text-right p-2">Prix Unitaire</th>
            <th className="text-right p-2">Prix</th>
            <th className="w-16 p-2 print:hidden"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{item.description}</td>
              <td className="text-right p-2">{item.quantity}</td>
              <td className="text-right p-2">${Number(item.basePrice).toFixed(2)}</td>
              <td className="text-right p-2">${item.totalPrice.toFixed(2)}</td>
              <td className="p-2 print:hidden">
                <Button 
                  onClick={() => handleRemoveItem(index)}
		  className="w-full border-red-500 text-red-500 bg-transparent border hover:bg-red-50"
                >
                  ✕
                </Button>
              </td>
            </tr>
          ))}
          <tr className="print:hidden">
            <td className="p-2">
              <Input
                placeholder="Description"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              />
            </td>
            <td className="p-2">
              <Input
                type="number"
                placeholder="Quantité"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                className="text-right"
              />
            </td>
            <td className="p-2">
              <Input
                type="number"
                placeholder="Prix unitaire"
                value={newItem.basePrice}
                onChange={(e) => setNewItem({...newItem, basePrice: e.target.value})}
                className="text-right"
              />
            </td>
            <td className="p-2" colSpan="2">
              <Button onClick={handleAddItem} className="w-full">
                Ajouter
              </Button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Totals Table */}
      <div className="flex justify-end">
        <table className="w-64">
          <tbody>
            <tr className="border-b">
              <td className="p-2">Sous-total:</td>
              <td className="text-right p-2">${subtotal.toFixed(2)}</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">TVQ (9.975%):</td>
              <td className="text-right p-2">${tvq.toFixed(2)}</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">TPS (5%):</td>
              <td className="text-right p-2">${tps.toFixed(2)}</td>
            </tr>
            <tr className="border-b font-bold">
              <td className="p-2">Total:</td>
              <td className="text-right p-2">${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <style>{`
        @media print {
          @page {
            margin: 1cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          input {
            border: none;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Invoice;
