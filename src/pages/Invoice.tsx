export default function Invoice() {

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="invoice">

      <h3>GB CITADEL HOTEL</h3>
      <p>Lagos, Nigeria</p>

      <hr />

      <p>Guest: John Doe</p>
      <p>Room: 203</p>

      <hr />

      <p>Room Stay: ₦120,000</p>
      <p>Restaurant: ₦6,500</p>
      <p>Bar: ₦8,500</p>
      <p>Laundry: ₦2,500</p>
      <p>Pool: ₦3,000</p>

      <hr />

      <h3>Total: ₦140,500</h3>

      <button onClick={printInvoice}>
        Print Receipt
      </button>

      <style>
        {`
        .invoice{
          width:58mm;
          font-size:12px;
          font-family:monospace;
        }

        @media print {

          button{
            display:none;
          }

          body{
            width:58mm;
          }

        }
        `}
      </style>

    </div>
  );
}