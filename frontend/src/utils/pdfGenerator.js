import html2pdf from "html2pdf.js";

const numberToWords = (num) => {
  if (num === 0) return "Zero";

  const belowTwenty = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const convert = (n) => {
    if (n < 20) return belowTwenty[n] + " ";
    if (n < 100) return tens[Math.floor(n / 10)] + " " + belowTwenty[n % 10] + " ";
    if (n < 1000) return belowTwenty[Math.floor(n / 100)] + " Hundred " + convert(n % 100);
    if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand " + convert(n % 1000);
    if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh " + convert(n % 100000);
    return convert(Math.floor(n / 10000000)) + " Crore " + convert(n % 10000000);
  };

  return convert(num).trim();
};

export const generateInvoicePDF = (invoiceData, action = "download", docType = "Invoice") => {
  const container = document.createElement("div");
  container.className = "p-8 max-w-[210mm] mx-auto bg-white text-gray-900 font-sans text-xs leading-tight";

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const currentDate = formatDate(new Date());
  const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = invoiceData.discountAmount || 0;
  const grandTotal = invoiceData.grandTotal;
  const amountInWords = numberToWords(Math.round(grandTotal));

  const logoUrl = invoiceData.companyImage
    ? invoiceData.companyImage.replace('http://', 'https://')
    : null;

  const labels = {
    title: docType === "Estimate" ? "ESTIMATE / QUOTATION" : "TAX INVOICE",
    recipient: docType === "Estimate" ? "Estimate For:" : "Bill To:",
    details: docType === "Estimate" ? "Estimate Details:" : "Invoice Details:",
    idLabel: docType === "Estimate" ? "Ref No:" : "Invoice No:",
    idValue: docType === "Estimate" ? "EST-DRAFT" : (invoiceData.invoiceId || "DRAFT")
  };

  container.innerHTML = `
    <div class="border border-gray-400">
      <div class="flex justify-between items-center p-2 border-b border-gray-400">
        <h1 class="text-xl font-bold uppercase text-center w-full">${labels.title}</h1>
        <span class="absolute right-10 text-xs text-gray-500">ORIGINAL FOR RECIPIENT</span>
      </div>

      <div class="flex p-4 border-b border-gray-400 gap-4">
        ${logoUrl ? `<img src="${logoUrl}" class="w-24 h-24 object-contain border border-gray-200" crossorigin="anonymous" />` : ''}
        <div class="flex-1">
          <h2 class="text-lg font-bold uppercase text-indigo-900">${invoiceData.companyName || "Your Company Name"}</h2>
          <p class="whitespace-pre-line text-xs font-medium text-gray-600">${invoiceData.companyAddress || "Company Address"}</p>
          <p class="text-xs mt-1"><strong>Phone:</strong> ${invoiceData.companyMobile || ""}</p>
          <p class="text-xs"><strong>Email:</strong> ${invoiceData.companyEmail || ""}</p>
          <p class="text-xs"><strong>GSTIN:</strong> ${invoiceData.companyGstin || ""}</p>
          <p class="text-xs"><strong>State:</strong> ${invoiceData.companyState || ""}</p>
        </div>
      </div>

      <div class="flex border-b border-gray-400">
        <div class="w-1/2 p-2 border-r border-gray-400">
          <h3 class="font-bold border-b border-gray-300 mb-2 pb-1">${labels.recipient}</h3>
          <p class="font-bold text-sm">${invoiceData.customerName || "Walk-in Customer"}</p>
          <p class="text-xs break-words max-w-[90%]">${invoiceData.customerAddress || ""}</p>
          <div class="mt-1 space-y-0.5">
             <p class="text-xs custom-line"><strong>Mobile:</strong> ${invoiceData.customerMobile || "-"}</p>
             <p class="text-xs custom-line"><strong>GSTIN:</strong> ${invoiceData.customerGstin || ""}</p>
          </div>
        </div>
        <div class="w-1/2 p-2">
          <h3 class="font-bold border-b border-gray-300 mb-2 pb-1">${labels.details}</h3>
          <div class="grid grid-cols-[80px_1fr] gap-y-1 text-xs">
            <span class="font-medium text-gray-600">${labels.idLabel}</span> <span class="font-bold">${labels.idValue}</span>
            <span class="font-medium text-gray-600">Date:</span> <span>${currentDate}</span>
            <span class="font-medium text-gray-600">Place of Supply:</span> <span>${invoiceData.companyState || ""}</span>
          </div>
        </div>
      </div>

      <table class="w-full text-xs border-collapse">
        <thead>
          <tr class="bg-gray-100 border-b border-gray-400">
            <th class="border-r border-gray-400 p-2 w-[5%] text-center">#</th>
            <th class="border-r border-gray-400 p-2 w-[45%] text-left">Item Name</th>
            <th class="border-r border-gray-400 p-2 w-[10%] text-center">Qty</th>
            <th class="border-r border-gray-400 p-2 w-[15%] text-right">Price/Unit</th>
            <th class="border-r border-gray-400 p-2 w-[10%] text-right">GST</th>
            <th class="p-2 w-[15%] text-right">Amount</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-300">
          ${invoiceData.items.map((item, index) => `
            <tr>
              <td class="border-r border-gray-400 p-2 text-center text-gray-500">${index + 1}</td>
              <td class="border-r border-gray-400 p-2 font-medium">${item.name}</td>
              <td class="border-r border-gray-400 p-2 text-center">${item.qty}</td>
              <td class="border-r border-gray-400 p-2 text-right">${formatCurrency(item.price)}</td>
              <td class="border-r border-gray-400 p-2 text-right text-gray-500">${invoiceData.gstRate ?? 18}%</td>
              <td class="p-2 text-right font-bold">${formatCurrency(item.price * item.qty)}</td>
            </tr>
          `).join('')}
          <tr class="h-24"><td class="border-r border-gray-400"></td><td class="border-r border-gray-400"></td><td class="border-r border-gray-400"></td><td class="border-r border-gray-400"></td><td class="border-r border-gray-400"></td><td></td></tr>
        </tbody>
      </table>

      <div class="border-t border-gray-400">
        <div class="flex justify-end">
          <div class="w-1/2 border-l border-gray-400">
             <div class="flex justify-between p-1 px-2 border-b border-gray-300">
              <span>Sub Total</span>
              <span>${formatCurrency(subtotal)}</span>
            </div>
            ${discountAmount > 0 ? `
            <div class="flex justify-between p-1 px-2 border-b border-gray-300 text-green-700">
              <span>Discount (${invoiceData.discount || 0}%)</span>
              <span>- ${formatCurrency(discountAmount)}</span>
            </div>` : ''}
            <div class="flex justify-between p-1 px-2 border-b border-gray-300">
              <span>GST (${invoiceData.gstRate ?? 18}%)</span>
              <span>${formatCurrency(invoiceData.gst)}</span>
            </div>
            <div class="flex justify-between p-2 font-bold text-sm bg-gray-50">
              <span>Grand Total</span>
              <span>${formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="border-t border-gray-400 p-2 text-xs">
        <strong>${docType === "Estimate" ? "Estimate" : "Invoice"} Amount in Words:</strong> <span class="italic capitalize">${amountInWords} Rupees Only</span>
      </div>

     ${invoiceData.description ? `
      <div class="border-t border-gray-400 p-2 text-xs">
        <p class="font-bold mb-1">Description / Notes:</p>
        <p class="whitespace-pre-wrap text-gray-700">${invoiceData.description}</p>
      </div>` : ''}

       <div class="border-t border-gray-400 flex">
         <div class="w-1/2 p-2 border-r border-gray-400 text-xs">
           <h3 class="font-bold mb-2">Bank Details:</h3>
           <div class="flex gap-2">
              ${invoiceData.qrCode ? `<img src="${invoiceData.qrCode}" class="w-20 h-20 object-contain border" crossorigin="anonymous" />` : ''}
              <div class="space-y-1">
                <p><strong>Bank:</strong> ${invoiceData.companyBankName || ""}</p>
                <p><strong>A/c No:</strong> ${invoiceData.companyBankAccount || ""}</p>
                <p><strong>IFSC:</strong> ${invoiceData.companyIfscCode || ""}</p>
                <p class="text-[10px] text-gray-500 mt-1">Scan QR to Pay via UPI</p>
              </div>
           </div>
         </div>
         <div class="w-1/2 p-2 flex flex-col justify-between text-xs text-center">
            <div class="text-left mb-4">
              <strong>Terms and Conditions:</strong>
              <p class="text-[10px] text-gray-500">1. Goods once sold will not be taken back.</p>
              <p class="text-[10px] text-gray-500">2. Interest @18% p.a. will be charged if bill is not paid on due date.</p>
              ${docType === "Estimate" ? '<p class="text-[10px] text-gray-500 mt-1 font-bold">This is an estimate, not a valid tax invoice.</p>' : ''}
            </div>
            <div class="mt-4">
              <p class="font-bold mb-8">For ${invoiceData.companyName || "Company Name"}</p>
              <p class="border-t border-gray-400 w-3/4 mx-auto pt-1">Authorized Signatory</p>
            </div>
         </div>
       </div>
 
     </div>
   `;

  const styles = `
     <style>
       @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
       body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; }
       p { margin: 0; padding: 0; line-height: 1.3; }
       .custom-line { display: flex; align-items: flex-start; gap: 4px; }
     </style>
   `;

  const opt = {
    margin: 5,
    filename: `${docType}_${invoiceData.invoiceId || "Draft"}.pdf`,
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  if (action === "print") {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<html><head><title>Print ${docType}</title>${styles}<script src="https://cdn.tailwindcss.com"></script></head><body>${container.innerHTML}</body></html>`);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    }
  } else if (action === "blob") {
    return html2pdf().from(container).set(opt).outputPdf('blob');
  } else if (action === "base64") {
    return html2pdf().from(container).set(opt).outputPdf('datauristring');
  } else {
    html2pdf().from(container).set(opt).save();
  }
};
