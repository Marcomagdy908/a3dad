import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Container, Alert, Button, Form, Row, Col } from "react-bootstrap";
function Scan() {
  // A simpler, more manageable state structure for checkboxes
  const initialCheckState = {
    قداس: false,
    تناول: false,
    اعتراف: false,
    ادوات: false,
    صلاة: false,
  };

  const [scanResult, setScanResult] = useState("");
  const [error, setError] = useState("");
  const [checkState, setCheckState] = useState(initialCheckState);

  const scannerId = "html5qr-code-full-region";

  useEffect(() => {
    if (scanResult) return;

    const html5QrcodeScanner = new Html5Qrcode(scannerId, /* verbose= */ false);

    const qrCodeSuccessCallback = async (decodedText: string) => {
      // Stop the scanner BEFORE updating state to prevent race conditions
      if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
        await html5QrcodeScanner.stop();
      }

      // Now that the scanner is stopped, safely update the state
      setScanResult(decodedText);
      setError("");

      const existingData = localStorage.getItem(`data/${decodedText}`);
      if (existingData) {
        try {
          setCheckState(JSON.parse(existingData));
        } catch (e) {
          console.error("Failed to parse existing data", e);
          setCheckState(initialCheckState);
        }
      }
    };

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrcodeScanner
      .start(
        { facingMode: "environment" },
        config,
        qrCodeSuccessCallback,
        (errorMessage) => {}
      )
      .catch((err) => {
        setError(`QR Code Scanner failed to start: ${err}`);
      });

    return () => {
      if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
        html5QrcodeScanner
          .stop()
          .then(() => console.log("QR Code scanning stopped."))
          .catch((err) => console.error("Failed to stop QR scanner.", err));
      }
    };
  }, [scanResult]);

  useEffect(() => {
    if (scanResult) {
      localStorage.setItem(`data/${scanResult}`, JSON.stringify(checkState));
    }
  }, [checkState, scanResult]);

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;
    setCheckState((prevState) => ({
      ...prevState,
      [id]: checked,
    }));
  };

  const handleScanAnother = () => {
    setScanResult("");
    setCheckState(initialCheckState); // Reset checkbox state
  };
  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}

      {scanResult ? (
        <div>
          <h2>Scan Successful!</h2>
          <Alert variant="success">
            <p className="mb-0">Scanned Data:</p>
            <strong style={{ wordBreak: "break-all" }}>{scanResult}</strong>
          </Alert>
          <Row className="mt-4">
            <Col md={8}>
              <Form>
                <Form.Label>Check applicable items:</Form.Label>
                <Form.Group
                  controlId="scannedData"
                  className="d-flex gap-5 flex-wrap"
                >
                  <Form.Check
                    type="checkbox"
                    id="قداس"
                    label="القداس"
                    onChange={handleCheckChange}
                    checked={checkState.قداس}
                  />
                  <Form.Check
                    type="checkbox"
                    id="تناول"
                    label="التناول"
                    onChange={handleCheckChange}
                    checked={checkState.تناول}
                  />
                  <Form.Check
                    type="checkbox"
                    id="اعتراف"
                    label="اعتراف"
                    onChange={handleCheckChange}
                    checked={checkState.اعتراف}
                  />
                  <Form.Check
                    type="checkbox"
                    id="ادوات"
                    label="الادوات"
                    onChange={handleCheckChange}
                    checked={checkState.ادوات}
                  />
                  <Form.Check
                    type="checkbox"
                    id="صلاة"
                    label="الصلاة"
                    onChange={handleCheckChange}
                    checked={checkState.صلاة}
                  />
                </Form.Group>
              </Form>
            </Col>
            <Col
              md={4}
              className="d-flex align-items-start justify-content-md-end mt-3 mt-md-0"
            >
              <Button variant="secondary" onClick={handleScanAnother}>
                Scan Another
              </Button>
            </Col>
          </Row>
        </div>
      ) : (
        <div>
          <h2>QR Code Scanner</h2>
          <p>Point your camera at a QR code to scan it.</p>
          <div
            id={scannerId}
            style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}
          />
        </div>
      )}
    </Container>
  );
}

export default Scan;
