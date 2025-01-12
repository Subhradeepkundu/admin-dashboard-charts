API Documentation:

Endpoint: http://localhost:5000/api/inventory

Request Parameters:
vehicleMake (optional) - The make of the vehicle to filter by (e.g., "Toyota", "Ford").
duration (optional) - The duration filter for inventory data:
lastMonth
thisMonth
last3Months
last6Months
thisYear
lastYear
Example Request:

GET /api/inventory?vehicleMake=Toyota&duration=thisMonth
Response Format:
json


{
  "recentData": {
    "vehicleType": "NEW",
    "make": "Toyota",
    "msrp": 25000,
    "date": "2025-01-10"
  },
  "inventoryCount": {
    "NEW": {
      "count": 10,
      "totalMSRP": 250000,
      "avgMSRP": 25000
    },
    "USED": {
      "count": 5,
      "totalMSRP": 150000,
      "avgMSRP": 30000
    },
    "CPO": {
      "count": 3,
      "totalMSRP": 90000,
      "avgMSRP": 30000
    }
  },
  "historyLog": [
    {
      "date": "2024-12-01",
      "NEW": {
        "count": 12,
        "totalMSRP": 300000,
        "avgMSRP": 25000
      },
      "USED": {
        "count": 7,
        "totalMSRP": 210000,
        "avgMSRP": 30000
      },
      "CPO": {
        "count": 4,
        "totalMSRP": 120000,
        "avgMSRP": 30000
      }
    }
  ]
}