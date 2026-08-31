# AquaSaksham Receiver Security Setup

## Goal

Only the physical receiver that owns a receiver credential can upload sensor data for that receiver.

The flow is:

LoRa -> ESP32 Receiver -> Wi-Fi -> POST /api/sensors/data -> Backend -> SQLite -> Website

## Device credentials

Prototype credentials configured by the database migration:

| Receiver ID | Node ID | Receiver Key |
|---|---:|---|
| AS-RX-001 | 1 | AquaRx001@2026 |
| AS-RX-002 | 2 | AquaRx002@2026 |

Change these keys before production.

## Upload endpoint

`POST http://YOUR_SERVER:5000/api/sensors/data`

Required headers:

- `Content-Type: application/json`
- `x-receiver-id: AS-RX-001`
- `x-receiver-key: AquaRx001@2026`

JSON body:

```json
{
  "ph": 7.50,
  "tds": 370,
  "turbidity": 3.5,
  "battery": 100
}
```

The backend does NOT trust `receiver_id` or `nodeID` from the JSON body. It gets the receiver identity from the authenticated device credential.

## Website isolation

After login, the JWT contains the logged-in `receiver_id` and `node_id`.

Protected dashboard endpoints query using the receiver ID from the verified JWT:

- `GET /api/sensors/latest`
- `GET /api/sensors/history`
- `GET /api/alerts`
- `GET /api/ai/analysis`

Therefore AS-RX-001 cannot read AS-RX-002 data with its dashboard token.

## Important

Receiver ID is an identifier, not a password. The `x-receiver-key` is the device secret.

For production, use HTTPS/TLS and unique random keys per physical receiver.
