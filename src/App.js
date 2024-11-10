import React, { useState, useEffect } from "react";
import { Printer, Trash2 } from "lucide-react";
import { Button } from "./components/button";
import { Input } from "./components/input";

const Invoice = () => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [items, setItems] = useState([]);
  const [tpsCode, setTpsCode] = useState("");
  const [tvqCode, setTvqCode] = useState("");
  const [newItem, setNewItem] = useState({
    description: "",
    quantity: "",
    basePrice: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [sender, setSender] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [receiver, setReceiver] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const loadSavedData = () => {
      const savedSender = localStorage.getItem("invoice_sender");
      const savedReceiver = localStorage.getItem("invoice_receiver");
      const savedTpsCode = localStorage.getItem("invoice_tps_code");
      const savedTvqCode = localStorage.getItem("invoice_tvq_code");

      if (savedSender) {
        const parsedSender = JSON.parse(savedSender);
        setSender((prev) => ({ ...prev, ...parsedSender }));
      }
      if (savedReceiver) {
        const parsedReceiver = JSON.parse(savedReceiver);
        setReceiver((prev) => ({ ...prev, ...parsedReceiver }));
      }
      if (savedTpsCode) setTpsCode(savedTpsCode);
      if (savedTvqCode) setTvqCode(savedTvqCode);
    };

    loadSavedData();
  }, []);

  // Save sender data when it changes
  const saveSenderData = (newData) => {
    setSender(newData);
    localStorage.setItem("invoice_sender", JSON.stringify(newData));
  };

  // Save receiver data when it changes
  const saveReceiverData = (newData) => {
    setReceiver(newData);
    localStorage.setItem("invoice_receiver", JSON.stringify(newData));
  };

  // Save tax codes
  useEffect(() => {
    if (tpsCode) localStorage.setItem("invoice_tps_code", tpsCode);
  }, [tpsCode]);

  useEffect(() => {
    if (tvqCode) localStorage.setItem("invoice_tvq_code", tvqCode);
  }, [tvqCode]);

  const validateField = (name, value) => {
    switch (name) {
      case "invoiceNumber":
        return !value ? "Le numéro de facture est requis" : "";
      case "invoiceDate":
        return !value ? "La date est requise" : "";
      case "sender.name":
        return !value ? "Le nom est requis" : "";
      case "sender.phone":
        return !value ? "Le téléphone est requis" : "";
      case "sender.email":
        return !value ? "Le courriel est requis" : "";
      case "receiver.name":
        return !value ? "Le nom est requis" : "";
      case "tpsCode":
        return !value ? "Le code TPS est requis" : "";
      case "tvqCode":
        return !value ? "Le code TVQ est requis" : "";
      default:
        return "";
    }
  };

  const handleBlur = (field, value) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handlePrint = () => {
    const newErrors = {
      invoiceNumber: validateField("invoiceNumber", invoiceNumber),
      invoiceDate: validateField("invoiceDate", invoiceDate),
      "sender.name": validateField("sender.name", sender.name),
      "sender.phone": validateField("sender.phone", sender.phone),
      "sender.email": validateField("sender.email", sender.email),
      "receiver.name": validateField("receiver.name", receiver.name),
      tpsCode: validateField("tpsCode", tpsCode),
      tvqCode: validateField("tvqCode", tvqCode),
    };

    setErrors(newErrors);
    setTouched({
      invoiceNumber: true,
      invoiceDate: true,
      "sender.name": true,
      "sender.phone": true,
      "sender.email": true,
      "receiver.name": true,
      tpsCode: true,
      tvqCode: true,
    });

    if (Object.values(newErrors).some((error) => error)) {
      alert("Veuillez remplir tous les champs requis avant d'imprimer");
      return;
    }

    window.print();
  };

  const handleAddItem = () => {
    if (newItem.description && newItem.quantity && newItem.basePrice) {
      setItems([
        ...items,
        {
          ...newItem,
          totalPrice: Number(newItem.quantity) * Number(newItem.basePrice),
        },
      ]);
      setNewItem({ description: "", quantity: "", basePrice: "" });
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
    return touched[field] && errors[field] ? "border-red-500" : "";
  };

  const ErrorMessage = ({ field }) => {
    if (touched[field] && errors[field]) {
      return <div className="text-red-500 text-xs mt-1">{errors[field]}</div>;
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      {/* Tax Registration Numbers */}
      <div className="mb-4 print:hidden">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <h2 className="font-bold mb-1 h-6">Code TPS:</h2>
            <Input
              placeholder="Code TPS *"
              value={tpsCode}
              onChange={(e) => setTpsCode(e.target.value)}
              onBlur={() => handleBlur("tpsCode", tpsCode)}
              className={inputStyle("tpsCode")}
            />
            <ErrorMessage field="tpsCode" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-bold mb-1 h-6">Code TVQ:</h2>
            <Input
              placeholder="Code TVQ *"
              value={tvqCode}
              onChange={(e) => setTvqCode(e.target.value)}
              onBlur={() => handleBlur("tvqCode", tvqCode)}
              className={inputStyle("tvqCode")}
            />
            <ErrorMessage field="tvqCode" />
          </div>
        </div>
      </div>

      {/* Print Button */}
      <div className="flex justify-end mb-4 print:hidden">
        <Button
          variant="outline"
          onClick={handlePrint}
          className="flex items-center gap-2"
        >
          <Printer size={16} /> Imprimer
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
                onBlur={() => handleBlur("invoiceDate", invoiceDate)}
                className={`w-40 ${inputStyle("invoiceDate")}`}
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
                onBlur={() => handleBlur("invoiceNumber", invoiceNumber)}
                className={`w-32 ${inputStyle("invoiceNumber")}`}
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
              onChange={(e) =>
                saveSenderData({ ...sender, name: e.target.value })
              }
              onBlur={() => handleBlur("sender.name", sender.name)}
              className={`py-1 font-bold ${inputStyle("sender.name")}`}
            />
            <ErrorMessage field="sender.name" />
          </div>
          <div className="mb-1">
            <Input
              placeholder="Téléphone *"
              value={sender.phone}
              onChange={(e) =>
                saveSenderData({ ...sender, phone: e.target.value })
              }
              onBlur={() => handleBlur("sender.phone", sender.phone)}
              className={`py-1 ${inputStyle("sender.phone")}`}
            />
            <ErrorMessage field="sender.phone" />
          </div>
          <div className="mb-1">
            <Input
              placeholder="Courriel *"
              value={sender.email}
              onChange={(e) =>
                saveSenderData({ ...sender, email: e.target.value })
              }
              onBlur={() => handleBlur("sender.email", sender.email)}
              className={`py-1 ${inputStyle("sender.email")}`}
            />
            <ErrorMessage field="sender.email" />
          </div>
        </div>
        <div>
          <h2 className="font-bold mb-1 h-6">Facturé à:</h2>
          <div className="mb-1">
            <Input
              placeholder="Nom *"
              value={receiver.name}
              onChange={(e) =>
                saveReceiverData({ ...receiver, name: e.target.value })
              }
              onBlur={() => handleBlur("receiver.name", receiver.name)}
              className={`py-1 ${inputStyle("receiver.name")}`}
            />
            <ErrorMessage field="receiver.name" />
          </div>
          <Input
            placeholder="Adresse"
            className={`mb-1 py-1 ${!receiver.address ? "print:hidden" : ""}`}
            value={receiver.address}
            onChange={(e) =>
              saveReceiverData({ ...receiver, address: e.target.value })
            }
          />
          <Input
            placeholder="Téléphone"
            className={`mb-1 py-1 ${!receiver.phone ? "print:hidden" : ""}`}
            value={receiver.phone}
            onChange={(e) =>
              saveReceiverData({ ...receiver, phone: e.target.value })
            }
          />
          <Input
            placeholder="Courriel"
            className={`py-1 ${!receiver.email ? "print:hidden" : ""}`}
            value={receiver.email}
            onChange={(e) =>
              saveReceiverData({ ...receiver, email: e.target.value })
            }
          />
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8 border-collapse">
        <thead className="bg-slate-100">
          <tr className="border-b border-gray-300">
            <th className="text-left p-2">Description</th>
            <th className="text-right p-2">Quantité</th>
            <th className="text-right p-2">Prix Unitaire</th>
            <th className="text-right p-2">Prix</th>
            <th className="w-16 p-2 print:hidden"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b border-gray-300">
              <td className="px-2 py-1">{item.description}</td>
              <td className="text-right px-2 py-1">{item.quantity}</td>
              <td className="text-right px-2 py-1">
                ${Number(item.basePrice).toFixed(2)}
              </td>
              <td className="text-right px-2 py-1">
                ${item.totalPrice.toFixed(2)}
              </td>
              <td className="px-2 py-1 print:hidden">
                <Button
                  onClick={() => handleRemoveItem(index)}
                  className="w-full border-red-500 text-red-500 bg-transparent border hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
          <tr className="print:hidden">
            <td className="p-2">
              <Input
                placeholder="Description"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
              />
            </td>
            <td className="p-2">
              <Input
                type="number"
                placeholder="Quantité"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: e.target.value })
                }
                className="text-right"
              />
            </td>
            <td className="p-2">
              <Input
                type="number"
                placeholder="Prix unitaire"
                value={newItem.basePrice}
                onChange={(e) =>
                  setNewItem({ ...newItem, basePrice: e.target.value })
                }
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
        <table className="w-auto border-collapse">
          <tbody>
            <tr className="border-b border-gray-300 bg-slate-100">
              <td className="p-2">Sous-total:</td>
              <td className="text-right p-2">${subtotal.toFixed(2)}</td>
            </tr>
            <tr className="border-b border-gray-300 bg-slate-50">
              <td className="p-2">TPS (5%) ({tpsCode}):</td>
              <td className="text-right p-2">${tps.toFixed(2)}</td>
            </tr>
            <tr className="border-b border-gray-300 bg-slate-50">
              <td className="p-2">TVQ (9.975%) ({tvqCode}):</td>
              <td className="text-right p-2">${tvq.toFixed(2)}</td>
            </tr>
            <tr className="border-b border-gray-300 font-bold bg-slate-200">
              <td className="p-2">Total:</td>
              <td className="text-right p-2">${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <style>{`
        input:placeholder-shown {
          background-color: #FFFBEB;
        }

        /* When input gets focus or has value, return to white background */
        input:not(:placeholder-shown),
        input:focus {
          background-color: white;
        }
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
            background-color: transparent;
          }
        }
      `}</style>
    </div>
  );
};

export default Invoice;
