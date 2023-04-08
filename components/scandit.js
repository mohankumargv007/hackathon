import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import * as SDCCore from "scandit-web-datacapture-core";
import * as SDCBarcode from "scandit-web-datacapture-barcode";

const libraryLocation = 'https://cdn.jsdelivr.net/npm/scandit-web-datacapture-barcode@6.x/build/engine/';
const licenseKey = 'AfZydWVhRvlIKSgyqzoAZw0OHeoICxgiFXidHWkiBNKGR70WBHcavoB+A/Fhde//+lhijfd17iJAcD0+31VRTBpb2olPbbidp0me/Y0x93ZdKL0BpiC2WXoBWs2jGMNp242GhUh4UiC2DGSwtxJP8AbWXRM90PDWQM+Ylfi+sg+GFHTiSzRHj5sl/PbYJ/PS+G3eOWsBgY2IwjbMZF8nMkiHrTSN5as5Ro4MvkzFh4kQmcpTygh2Q9evtzdxQ2HVdrtDLyEghW2SjLTsrLU8hf524d+Mr3MgUNPDg3kJxQpXjLO2IdMUaxfmd5KmYM/ndBj7PulfiJMpKIqzqTQWy9FyQZmx0mipncKDUXe7eg8azirRRleZPa9w08DV4f2TWQd1Uk1SWeVO9akXbtKBN7OEu8BbPwvqhqXWRLW2xYcckHQ2mdX1LQ9qgHe/qR49k2GrezxLQ9F8wlwIRidr2RbV0NKd8BEIxh9Rk3UqjaAVXlXUGMyQRf21KxXaDcCC0XQL3QVRe1ZCCIcCWSegYw2tf2GGJvf/sk0tLjel86G0huIuNW0hT2irJY0sW2II+66M8NHkjI9p32w4oL9QgD8pkWlOZP+ySXYYrLnO2gEEhh73WY4s1ij/fSAxB2mEXJiX8iDpv7BR0eKneZ3pqdrP8DT2Yw7pEZ6/Qd/IdoNiOfWZnuyD2GW1fw3UtsqqNZx0om5Xl0d4b7LygwBujsuXbvcBLaz8ZuOv7jbAO5duzsl/hYsbRqQSh8FFgU6+CLOEXz38j1oJQbcEoqNvLxV6AoJ09syliWDRHrDwBA==';


const Scandit = React.memo(function Scandit(props) {
  const { btnText } = props;
  const [value, setValue] = useState("");
  // Keep a reference to the context object.
  let context;
  // Keep a reference to the barcode capture mode object.
  let barcodeCapture;

  async function loadAndPrepareLibrary() {
    // Configure and load the library using your license key. The passed parameter represents the location of the wasm
    // file, which will be fetched asynchronously. You must `await` the returned promise to be able to continue.
    await SDCCore.configure({
      licenseKey: process.env.NEXT_PUBLIC_SCANDIT_LICENCE_KEY || licenseKey,
      libraryLocation: process.env.NEXT_PUBLIC_SCANDIT_LIB_LOCATION || libraryLocation,
      moduleLoaders: [
        SDCBarcode.barcodeCaptureLoader({ highEndBlurryRecognition: false })
      ]
    })

    // Create the data capture context.
    context = await SDCCore.DataCaptureContext.create()

    // Try to use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
    // default and must be turned on to start streaming frames to the data capture context for recognition.
    await context.setFrameSource(SDCCore.Camera.default)

    // The barcode capturing process is configured through barcode capture settings,
    // they are then applied to the barcode capture instance that manages barcode recognition.
    const settings = new SDCBarcode.BarcodeCaptureSettings()

    // The settings instance initially has all types of barcodes (symbologies) disabled. For the purpose of this
    // sample we enable a very generous set of symbologies. In your own app ensure that you only enable the
    // symbologies that your app requires as every additional enabled symbology has an impact on processing times.
    settings.enableSymbologies([
      SDCBarcode.Symbology.EAN13UPCA,
      SDCBarcode.Symbology.EAN8,
      SDCBarcode.Symbology.UPCE,
      SDCBarcode.Symbology.QR,
      SDCBarcode.Symbology.DataMatrix,
      SDCBarcode.Symbology.Code39,
      SDCBarcode.Symbology.Code128,
      SDCBarcode.Symbology.InterleavedTwoOfFive
    ])

    // Create a new barcode capture mode with the settings from above.
    barcodeCapture = await SDCBarcode.BarcodeCapture.forContext(
      context,
      settings
    )
    // Disable the barcode capture mode until the camera is accessed.
    await barcodeCapture.setEnabled(false)

    // Register a listener to get informed whenever a new barcode got recognized.
    barcodeCapture.addListener({ didScan })

    // To visualize the ongoing barcode capturing process on screen, set up a data capture view that renders the
    // camera preview. The view must be connected to the data capture context.
    const view = await SDCCore.DataCaptureView.forContext(context)

    const dataCaptureView = document.getElementById('data-capture-view');
    if(dataCaptureView && view) {
      // Connect the data capture view to the HTML element.
      view.connectToElement(dataCaptureView)

      // Add a control to be able to switch cameras.
      view.addControl(new SDCCore.CameraSwitchControl())
    }
  }

  // Close the modal and switch off the camera.
  async function closeScanner() {
    try {
      if(context && context.frameSource) {
        await context.frameSource.switchToDesiredState(SDCCore.FrameSourceState.Off)
      }
      const dataCaptureView = document.getElementById("data-capture-view");
      if(dataCaptureView) { dataCaptureView.style.height = "0px"; }
    } catch(err) {
      console.log("Error: Scandit unmount failed error - ", err);
    }
  }

  // Open our modal and start the camera to scan a barcode.
  async function openScanner() {
    await loadAndPrepareLibrary();
    document.getElementById("data-capture-view").style.height = "auto";
    await wait(50)
    // Start the camera. This can potentially fail, so we use try/catch.
    try {
      await context.frameSource.switchToDesiredState(
        SDCCore.FrameSourceState.On
      )
      await barcodeCapture.setEnabled(true)
    } catch (error) {
      const reason =
        typeof error === "object" &&
        error != null &&
        typeof error["toString"] === "function"
          ? error.toString()
          : "unknown error"
      alert(`Could not start camera: ${reason}`)
      await closeScanner()
    }
  }

  // When a scan happened, we populate the input and close the modal.
  async function didScan(barcodeCaptureMode, session) {
    await barcodeCapture.setEnabled(false)
    const barcode = session.newlyRecognizedBarcodes[0]
    await closeScanner();
    setValue(barcode.data ?? "");
  }

  // Wait for X milliseconds
  async function wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  useEffect(() => {
    // Load the library as soon as possible. This will make the user experience faster.
    // loadAndPrepareLibrary();
    return () => {
      closeScanner();
    };
  }, []);

  useEffect(() => {
    // This will return the scanned value to parent component.
    value.length > 2 && props.onDetected(value);
  }, [value]);
  
  const handleScanner = () => {
    openScanner();
  }

  return (
    <>
      <Button onClick={handleScanner} variant="contained" >{btnText}</Button>
      <div id="data-capture-view"></div>
    </>
  )
})

export default Scandit;