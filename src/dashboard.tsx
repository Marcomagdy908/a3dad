import { useState, useEffect } from "react";
import {
  Container,
  Button,
  Card,
  Table,
  Alert,
  ButtonGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface CheckState {
  قداس: boolean;
  تناول: boolean;
  اعتراف: boolean;
  ادوات: boolean;
  صلاة: boolean;
}

interface ScannedEntry {
  qrCode: string;
  checks: CheckState;
}

function Dashboard() {
  const loadDataFromStorage = () => {
    const allEntries: ScannedEntry[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("data/")) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const checks: CheckState = JSON.parse(value);
            const qrCode = key.substring(5); // Remove "data/" prefix
            allEntries.push({ qrCode, checks });
          }
        } catch (error) {
          console.error(`Error parsing data for key ${key}:`, error);
        }
      }
    }
    return allEntries;
  };

  const [data, setData] = useState<ScannedEntry[]>(loadDataFromStorage);

  useEffect(() => {
    const handleStorageChange = () => {
      setData(loadDataFromStorage()); // This now correctly re-reads from storage
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []); // Dependency array is empty as loadDataFromStorage is defined outside

  const handleExport = () => {
    if (data.length === 0) return;

    // Define headers from the first entry's checks object
    const headers = Object.keys(data[0].checks);
    const csvHeaders = ["QR Code", ...headers];

    // Convert data to CSV rows
    const csvRows = data.map((entry) => {
      const values = headers.map((header) => entry.checks[header]);
      // Wrap each value in quotes to handle potential commas in QR codes
      return [`"${entry.qrCode}"`, ...values].join(",");
    });

    // Combine headers and rows, and add a BOM for Excel to handle UTF-8 correctly
    const csvContent = "\uFEFF" + [csvHeaders.join(","), ...csvRows].join("\n");

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "a3dad_khodam_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    // Safely remove only app-specific data
    Object.keys(localStorage)
      .filter((key) => key.startsWith("data/"))
      .forEach((key) => localStorage.removeItem(key));
    setData([]); // Clear the state
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>
        {data.length > 0 && (
          <ButtonGroup>
            <Button variant="success" className="m-3" onClick={handleExport}>
              Export to Excel
            </Button>
            <Button variant="danger" className="m-3" onClick={clearData}>
              Clear All Data
            </Button>
          </ButtonGroup>
        )}
      </div>
      <div>
        {data.length > 0 ? (
          data.map((entry) => (
            <Card key={entry.qrCode} className="mb-3">
              <Card.Header>
                <Card.Title className="mb-0" style={{ wordBreak: "break-all" }}>
                  {entry.qrCode}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Checked</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(entry.checks).map(
                      ([checkKey, isChecked]) => (
                        <tr key={checkKey}>
                          <td>{checkKey}</td>
                          <td>{isChecked ? "✔️" : "❌"}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ))
        ) : (
          <Alert variant="info">
            No data found in local storage. Go to the 'Scan' page to add data.
          </Alert>
        )}
      </div>
    </Container>
  );
}

export default Dashboard;
