import { Button, Input } from "@nextui-org/react";
import html2pdf from "html2pdf.js";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Logo from "/logo.png";
import QRCode from "/qr-code.png";
import Stamp from "/stamp.png";
import Watermark from "/watermark.png";

interface Item {
  name: string;
  price: number;
}
function App() {
  const invoiceRef = useRef(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");

  const [itemName, setItemName] = useState<string>("");
  const [itemPrice, setItemPrice] = useState<string>();
  const [items, setItems] = useState<Item[]>([]);

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalDiscount, setTotalDiscount] = useState<string>("0");
  useEffect(() => {
    setTimeout(() => {
      setDate(new Date());
    }, 1000);
  }, [date]);

  useEffect(() => {
    const inv = localStorage.getItem("invoiceNumber");
    if (inv) {
      setInvoiceNumber("RM-" + inv);
    } else {
      setInvoiceNumber("RM-" + 0);
    }
  }, []);

  const generatePdf = () => {
    if (!customerName) {
      toast.error("Customer Name is required");
      return;
    }
    if (!customerPhoneNumber) {
      toast.error("Customer Phone Number is required");
      return;
    }
    if (!customerAddress) {
      toast.error("Customer Address is required");
      return;
    }
    if (items.length === 0) {
      toast.error("Add items to generate invoice");
      return;
    }
    // Define options for A4 size
    const options = {
      margin: 0,
      filename: `invoice-${invoiceNumber}.pdf`,
      image: { type: "jpeg", quality: 2 },
      html2canvas: { scale: 4 },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
        floatPrecision: 16,
      },
    };

    // Generate PDF
    html2pdf().set(options).from(invoiceRef.current).save();
    const newInvoiceNumber = parseInt(invoiceNumber.split("-")[1]) + 1;
    setInvoiceNumber("INV-" + newInvoiceNumber);
    localStorage.setItem("invoiceNumber", newInvoiceNumber.toString());
  };

  const handleAddItem = () => {
    if (items.length > 4) {
      toast.error("You can add only 5 items");
      return;
    }

    if (!itemName) {
      toast.error("Item Name is required");
      return;
    }
    if (!itemPrice) {
      toast.error("Item Price is required");
      return;
    }
    const newItem: Item = {
      name: itemName,
      price: parseInt(itemPrice),
    };
    setItems([...items, newItem]);
    setTotalAmount(totalAmount + parseInt(itemPrice));
    setItemName("");
    setItemPrice("");
  };

  return (
    <div className="flex flex-col gap-5 items-start justify-start *:w-full p-7">
      <div className="grid grid-cols-3 gap-5 p-3 bg-zinc-50 rounded-xl border">
        <h3 className="col-span-3 text-xl font-semibold">
          Customer Information
        </h3>
        <Input
          label="Customer Name"
          placeholder="Customer Name"
          labelPlacement="outside"
          variant="bordered"
          radius="sm"
          value={customerName}
          onValueChange={(value) => {
            if (value.length > 20) {
              toast.error("Name should be less than 20 characters");
              return;
            }
            setCustomerName(value);
          }}
        />
        <Input
          label="Customer Phone Number"
          placeholder="Customer Customer Phone Number"
          labelPlacement="outside"
          variant="bordered"
          radius="sm"
          value={customerPhoneNumber}
          onValueChange={(value) => {
            if (value.length > 10) {
              toast.error("Phone number should be 10 digits");
              return;
            }
            setCustomerPhoneNumber(value);
          }}
        />
        <Input
          label="Customer Address"
          placeholder="Customer Address"
          labelPlacement="outside"
          variant="bordered"
          radius="sm"
          value={customerAddress}
          onValueChange={(value) => {
            if (value.length > 100) {
              toast.error("Address should be less than 100 characters");
              return;
            }
            setCustomerAddress(value);
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-5 p-3 bg-zinc-50 rounded-xl border">
        <h3 className="col-span-3 text-xl font-semibold">Item Information</h3>
        <Input
          label="Item Name"
          placeholder="Item Name"
          labelPlacement="outside"
          variant="bordered"
          radius="sm"
          value={itemName}
          onValueChange={setItemName}
        />
        <Input
          label="Item Price"
          placeholder="Item Price"
          labelPlacement="outside"
          variant="bordered"
          radius="sm"
          value={itemPrice}
          onValueChange={setItemPrice}
        />
        <div className="col-span-3 flex justify-end items-center">
          <Button
            onPress={handleAddItem}
            variant="solid"
            className="col-span-3 bg-zinc-900 text-white font-medium"
          >
            Add Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 p-3 bg-zinc-50 rounded-xl border">
        <h3 className="col-span-3 text-xl font-semibold">
          Additional Information
        </h3>
        <Input
          label="Discount"
          placeholder="Discount"
          labelPlacement="outside"
          variant="bordered"
          radius="sm"
          value={totalDiscount}
          onValueChange={setTotalDiscount}
        />
      </div>
      <div className="p-3 flex justify-end items-center">
        <Button
          onClick={generatePdf}
          variant="solid"
          className="bg-zinc-900 text-white font-medium"
        >
          Create Invoice
        </Button>
      </div>
      <div
        ref={invoiceRef}
        id="invoice-container"
        className="relative p-7 bg-zinc-50 max-w-[800px] w-[21cm] h-[28.7cm] mx-auto"
      >
        <div className="absolute inset-0 w-full h-full flex justify-center items-center">
          <img
            src={Watermark}
            alt="watermark"
            className="w-96 h-96 object-cover opacity-20"
          />
        </div>
        <div className="flex flex-col justify-between items-start *:w-full h-full">
          <div className="flex flex-col gap-0 items-start justify-normal *:w-full">
            <div className="flex justify-between items-start gap-2.5">
              <div className="flex flex-col justify-start items-start gap-0">
                <h1 className="text-2xl font-semibold">
                  <span className="text-3xl">R.M</span> Gift and stationery
                </h1>
                <p className="text-xs font-semibold max-w-[200px]">
                  The Next Best Thing : Where 'Next' is new!
                </p>
              </div>
              <div className="w-52 h-28 -ml-7">
                <img
                  src={Logo}
                  alt="logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col justify-start items-start gap-0 *:w-full">
                <p className="text-xs font-semibold mb-2.5">Invoice No:</p>
                <p className="text-xs font-bold">Contact Info:</p>
                <p className="text-xs font-bold">Narendrapur Station Road,</p>
                <p className="text-xs font-bold">
                  Kadarat, Near R.M Gym Centre,
                </p>
                <p className="text-xs font-bold">
                  Narendrapur, Kolkata - 700150
                </p>
                <p className="text-xs font-bold">Phone: 9804936764</p>
                <p className="text-xs font-bold">
                  Email:rmgiftandstationary@gmail.com
                </p>
                <p className="text-xs font-semibold mt-5">
                  GSTIN: 19FXTPS5092F1ZJ
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center py-5">
              <h2 className="text-2xl font-semibold">RETAIL INVOICE</h2>
            </div>
            <div className="flex justify-between items-start py-5 gap-0.5 border-y border-black">
              <div className="flex flex-col justify-start items-start gap-0.5 *:w-full">
                <p className="text-sm font-semibold text-black">
                  Customer Details:
                </p>
                {customerName && (
                  <p className="text-xs font-semibold">{customerName}</p>
                )}
                {customerPhoneNumber && (
                  <p className="text-xs font-semibold">
                    +91 {customerPhoneNumber}
                  </p>
                )}
                {customerAddress && (
                  <p className="text-xs font-semibold max-w-xs">
                    {customerAddress}
                  </p>
                )}
              </div>
              <p className="text-xs font-medium">
                Date: <span className="w-[170px] h-1 block"></span>
              </p>
            </div>
            <div className="text-left grid grid-cols-7 pt-5 gap-5">
              <p className="text-sm font-semibold">S No.</p>
              <p className="text-sm font-semibold col-span-4">Item Name</p>
              <p className="text-sm font-semibold col-span-2 pl-5">
                Item Price
              </p>
            </div>
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-7 text-left py-2.5 gap-5"
              >
                <p className="text-xs font-semibold">{index + 1}</p>
                <p className="text-xs font-semibold col-span-4">
                  {item.name.length > 100
                    ? item.name.slice(0, 100) + "..."
                    : item.name}
                </p>
                <p className="text-xs font-semibold col-span-2 pl-5">
                  ₹{item.price}.0
                </p>
              </div>
            ))}
            <div className="flex justify-between items-start py-5 gap-5 border-t border-black mt-5 pr-10">
              <div className="flex flex-col justify-start items-start gap-1 *:w-full">
                <p className="text-xs font-medium">Total Amount</p>
                <p className="text-xs font-medium">Total Discount</p>
                <p className="text-xs font-medium">CGST 9%</p>
                <p className="text-xs font-medium">SGST 9%</p>
                <p className="text-xs font-medium">Net Amount</p>
              </div>
              <div className="flex flex-col justify-start items-start text-right gap-1 *:w-full">
                <p className="text-xs font-medium">₹{totalAmount}.0</p>
                <p className="text-xs font-medium">
                  ₹{totalDiscount ? totalDiscount : "0"}
                </p>
                <p className="text-xs font-medium">
                  ₹{(totalAmount - parseInt(totalDiscount)) * 0.09}
                </p>
                <p className="text-xs font-medium">
                  ₹{(totalAmount - parseInt(totalDiscount)) * 0.09}
                </p>
                <p className="text-xs font-medium">
                  ₹
                  {totalAmount -
                    parseInt(totalDiscount) +
                    (totalAmount - parseInt(totalDiscount)) * 0.18}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-auto flex justify-between gap-28">
            <div className="flex flex-col justify-start items-start gap-1 *:w-full">
              <p className="text-xs font-semibold">Terms & Conditions: </p>
              <p className="text-xs font-medium max-w-[220px]">
                • Goods once sold can not be taken back or exchange.
              </p>
              <p className="text-xs font-medium max-w-[220px]">
                • We accept credit and debit card
              </p>
              <p className="text-xs font-medium max-w-[220px]">
                • This is a computer generated invoice
              </p>
            </div>
            <div className="flex items-start gap-10">
              <div className="flex flex-col justify-start items-start gap-5">
                <p className="text-xs font-semibold ml-3">
                  Authorised signature
                </p>
                <img
                  src={Stamp}
                  alt="stamp"
                  className="w-20 h-20 object-contain mx-auto"
                />
                <p className="text-xs font-semibold ml-3">
                  My life powered by R.M
                </p>
              </div>

              <div className="flex flex-col justify-start items-start *:w-full">
                <p className="text-xs font-semibold ml-3">Payment Info:</p>
                <img
                  src={QRCode}
                  alt="qr-code"
                  className="w-44 h-44 object-contain -mt-1"
                />
                <p className="text-xs font-semibold ml-3">
                  Thank You for purchasing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
