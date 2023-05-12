import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import _get from 'lodash/get';
import * as SDCCore from "scandit-web-datacapture-core";
import * as SDCBarcode from "scandit-web-datacapture-barcode";

const libraryLocation = 'https://cdn.jsdelivr.net/npm/scandit-web-datacapture-barcode@6.x/build/engine/';
const licenseKey = 'AUNDYDZhFT7EHVRDRQmu9TcSJy06M2r5PjTWk7RvCbfpI8IUG2zVehF9IluhPxS5T1EjWmtAxk/UJylH/HoPSN5oeLeMeITRM1f9UfdE/viKUjIHKEVtIQpvUDGQeydZ8zksAjR3frlyQvuF5llF/KYkxvd0T/ZNBEhL8qppjz+PTTb2EmX7vHtFJYFHKMduOC5oNm0e7I7xDgGHSp8y5JlIJUHNa1UmyQYHLJBzCMuEBqQ5yzfZ5DohEgtVSHCxIKv20j+qB2W7xKNA3ecwy+qJgptwbRNuVtl53mk9rgJQzW4UMDtR3lE6JmPA+Ufj5HF1yshvDEoYtCeKvD3FSdwRP9u08zfdSUJyHvYkE1vVuWnftUiGMDzc+him9Mk7ZZD2MKUqSJW59pT2By6uUX6IUtA+4uoLEYxrJjGzOMcz0rjcJmNtPHq2Cv0bebrZzff6aMhj/eQDRbYaYp5yX5n929awB/uy79nuVeLWxGRUK4RP6GDHEJkaZs/R4aVlRh0PaqyYTkd1JZ284Rs+dQKdwId23H03PZIILrPbE22oOzZHaHc+gKAhO6yrCfA2nVqmir/bfuRfHT4vy0DHY7+7/pDYtc7lRXet5s7SpcKzpxnxJccO5zMAJkE/l3g1kN2c+MBJ+d2O1xIgWEccGQEXLtBD2HRPMxSE/tdiYPYXrADx9O7JbCcuJWpa/WlyH49SmSyo5eCiGidAgQNe6lKeYVKcP9Gdp9sL2pTgP1dKj+WRY2Uf4rTtWQTBNsw9Nmh5H8bcIY31D731m7yiLmyvbTXgJbb9w+6rKkRcCSthE8vlnis8zDpmpatnBQoo9de8nak8IC5X6oKWwgz7340P32VlWjTi3Bn74nHhDlndcpqelfjZbi4Qtx8=';


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
      licenseKey: _get(props, "scandit_licence_key") || licenseKey,
      libraryLocation: libraryLocation,
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
      if(dataCaptureView) { dataCaptureView.style.height = "0px"; dataCaptureView.style.marginTop = "0px"; }
    } catch(err) {
      console.log("Error: Scandit unmount failed error - ", err);
    }
  }

  // Open our modal and start the camera to scan a barcode.
  async function openScanner() {
    await loadAndPrepareLibrary();
    const width = screen.width;
    if(width < 678) {
      document.getElementById("data-capture-view").style.height = "210px";
    } else {
      document.getElementById("data-capture-view").style.height = "400px";
    }
    document.getElementById("data-capture-view").style.marginTop = "20px";
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
    <div>
      <Button onClick={handleScanner} variant="contained" fullWidth size="large">{btnText}</Button>
      <div id="data-capture-view"></div>
    </div>
  )
})

export default Scandit;