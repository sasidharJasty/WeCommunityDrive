import React, { useState, useEffect } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = () => {
  const [barcodeData, setBarcodeData] = useState('');

  useEffect(() => {
    Quagga.init({
      inputStream : {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('#scanner-container'),
        constraints: {
          width: 640,
          height: 480,
          facingMode: "environment"
        }
      },
      decoder : {
        readers : ["ean_reader"] // You can change this depending on the type of barcode you want to scan
      }
    }, function(err) {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
    });

    Quagga.onDetected(function(result) {
      const barcode = result.codeResult.code;
      console.log("Barcode detected and processed : [" + barcode + "]");
      setBarcodeData(barcode);
    });

    return () => {
      Quagga.stop();
    };
  }, []);

  return (
    <div>
      <h1>Barcode Scanner</h1>
      <div id="scanner-container"></div>
      {barcodeData && (
        <div>
          <h2>Detected Barcode:</h2>
          <p>{barcodeData}</p>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;