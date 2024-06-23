import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";

function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code matched = ${decodedText}`, decodedResult);
}

function onScanFailure(error) {
    //console.warn(`Code scan error = ${error}`);
}

const Scanner = () => {
    useEffect(() => {
        let html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);

        // Clean up the scanner when component unmounts
        return () => html5QrcodeScanner.clear();
    }, []);

    return (
        <div>
            <p>Hello World!</p>
            <div style={{ width: 500 }} id="reader"></div>
        </div>
    );
};

export default Scanner;
