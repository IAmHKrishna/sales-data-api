# Sales Data API

## Tech Stack
- Node.js
- TypeScript
- PostgreSQL
- TypeORM
- Express

## Prerequisites
- Node.js ≥ v18
- PostgreSQL ≥ v11
- `sample.csv` in the root directory

## Setup Instructions

```bash
git clone https://github.com/YOUR_USERNAME/sales-data-api.git
cd sales-data-api
npm install
npm start


```
---


##  Sample API 





---

### 1. Get Total Revenue

**Method:** `POST`
**Description:** Load and refresh CSV sales data into the database.
**Endpoint:**

```
http://localhost:3000/api/refresh
```

**Example Request :**

```bash
 "http://localhost:3000/api/revenue?startDate=2023-12-01&endDate=2024-06-30"
```

**Sample Response:**

```json
{
  "message": "CSV data refreshed successfully",
  "totalRecords": 6
}
```

---

### 2. Get Total Revenue

**Method:** `GET`
**Endpoint:**


**Sample Response:**

```json
{
  "totalRevenue": 4782.5675
}
```

---

###  3. Get Revenue by Product

**Method:** `GET`
**Endpoint:**

```
http://localhost:3000/api/revenue/by-product?startDate=2024-01-01&endDate=2024-06-01
```


**Sample Response:**

```json
[
  {
    "productId": "P456",
    "productName": "iPhone 15 Pro",
    "totalRevenue": 3802.1
  },
  {
    "productId": "P789",
    "productName": "Levi's 501 Jeans",
    "totalRevenue": 148.976
  },
  {
    "productId": "P123",
    "productName": "UltraBoost Running Shoes",
    "totalRevenue": 188
  },
  {
    "productId": "P234",
    "productName": "Sony WH-1000XM5 Headphones",
    "totalRevenue": 309.4915
  }
]
```



