import React, { useState, useEffect } from 'react';
import Barcode from 'react-barcode';
import { useZxing } from 'react-zxing';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

export default function CodexApp() {
  const [scan, setScan] = useState(null);
  const [devices, setDevices] = useState([]);
  const { deviceId } = useParams();

  const { ref } = useZxing({
    onResult(newScan) {
      setScan(newScan);
    },
    deviceId
  });

  useEffect(() => {
    (async () => {
      try {
        const availableDevices = await navigator.mediaDevices.enumerateDevices();
        const availableVideoDevices = availableDevices.filter(device => device.kind === 'videoinput');
        if (availableVideoDevices.length === 0) {
          alert('No cameras found');
        }
        else {
          setDevices(availableVideoDevices);
        }
      }
      catch (e) {
        alert('Failed to find cameras. This could be permissions problem');
      }
    })();
  }, []);

  const handleDownloadBackup = (barcodes) => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(barcodes)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'codex-backup.json';
    document.body.appendChild(element);
    element.click();
  };

  const handleUploadBackup = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const barcodes = JSON.parse(e.target.result);
      setScan(barcodes);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div>
        <h2>Scan Barcode:</h2>
        <video width="300" ref={ref} />
      </div>
      <div>
        <h2>Render Barcode:</h2>
        {scan && <Barcode value={scan.text} format={scan.format} height={200} />}
      </div>
      <div>
        <button onClick={() => handleDownloadBackup(scan)}>Download Backup</button>
        <input type="file" accept="application/json" onChange={handleUploadBackup} />
      </div>
    </div>
  );
}

CodexApp.propTypes = {
  code: PropTypes.string.isRequired, // the customer ID number
  format: PropTypes.string.isRequired // e.g. CODE39 or CODE128
};
