import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import _get from 'lodash/get';
import * as SDCCore from "scandit-web-datacapture-core";
import * as SDCBarcode from "scandit-web-datacapture-barcode";

const libraryLocation = 'https://cdn.jsdelivr.net/npm/scandit-web-datacapture-barcode@6.x/build/engine/';
const licenseKey = 'ARliCSphCaRqPjr2RSVODedD1xQ8Emxf4T0pNQExbFNYfYMPkVMPRP53rer2ON77cUWItbl99qxWTubojXANK9NeEi0qaFLVBGkqzhhfyGqiQfLJtC6Ew2hCKrNKW9fe4kMv2ZYzW/vUVgpOOUTpt8JkQgoyZVhZ52kBUWVRh1YTfk/ePnhlzwteKUW5EDGF7Wsk6tVbxiF0U7a06jo8FBZEd1JQba20knsAqVkH4Y/7VjJu6CR7fkEt24K2YbHa/RGAKUcbh86vGN+MuThpOLAmgX1+D8h0QsFy3Imkte96e77+OKfMOZKFIpjxwBa9Dj14rR4g2/iu/LdyiKWU6lX78CRXSmcgyU5LbmikUS6mOUnK+g73U2HdwZngelhkpQ8YAGtxRVALI6nA1T8eKRjgwIVu9h4vqxys4NBKOTqk2bCF0frkvn2Pjmcm7YESwPUACCt7CvfkhZquTdfEstm3idiO2cjkQhmEzY9hf4M4kYOyKRPahRwXycPJ2T1DiTZeVfNuf/g+Zo43uuRkLE83Rl47r9l+KccP35Fkn7Hj1uyHy2UdNWqu2N+A50WmueuntPJY96+DitmekzYRrs0YuBovlHLVGHn6XhUiCq4ft8Qgs4umw1OdNXFmlSLQre8LyVt6x2cOgc+AkcW9ZQyxAOygbWtCPzbmpkH3h9t/F88fPIs2z6nvJXHkFTz6DWAkd/Ox/dK/HzctMvkWXFUsGrxbP91aZSFtBMGVV2QH+qNlCrwq348FspzcPHe/LlIJgTiSjO0UMgVS7WxJEoQIabLSQe/QpolP6CgvhdfZH7MXF6/ktXYQUAV3jGI675DsZhR48Qh2uRNJ2F1DhZ50ekNxrZ5HSn9RiOSl0tY/RxG8CWM8cKrZnqQMwaPHIUh16JPeqTF4MPnZljYTI/1xW3YTtFd7/B75DaurBTECxd2+Mq/5nUJTabyar3sPSH1BYjNI';


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
      if(dataCaptureView) { dataCaptureView.style.height = "0px"; }
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