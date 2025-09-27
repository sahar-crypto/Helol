# API Endpoints

- This project uses FastAPI’s built-in interactive docs.

- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

`You can explore endpoints, see parameters, and try real requests directly from the browser.`

- This document lists available endpoints with example requests and responses.


## 1. Root

**GET** `/`

Returns a Basic message.

**Response**
```json
{ "message": "Complaint Solution Finder API is running" }
```

## 2. Upsert Complaints/Solutions

**POST** `/upsert`

Insert one or more complaint-solution pairs into Pinecone.

`Request Body`
```
[
  {
    "id": "1",
    "fields": {
      "complaint_text": "المياه مقطوعة في الزمالك",
      "solution_text": "عودة المياه الساعة 10 مساءً",
      "category": "Water"
    }
  },
  {
    "id": "2",
    "fields": {
      "complaint_text": "انقطاع الكهرباء في المعادي",
      "solution_text": "عودة الكهرباء الساعة 8 مساءً",
      "category": "Electricity"
    }
  }
]
```

## 3. Search Complaints
**[Most important one for the project]**

**GET** `/search`

Query similar complaints and solutions.

**Example 1** – High similarity

**Request**

`/search?query=المياه مقطوعة في الزمالك`

**Response** (example)
```
{
  "results": [
    {
      "complaint_text": "المياه مقطوعة في الزمالك",
      "solution_text": "عودة المياه الساعة 10 مساءً",
      "similarity": 95
    }
  ]
}
```
**Example 2** – Low similarity

**Request**

`/search?query=انقطاع الكهرباء في المعادي&top_k=1`


**Response** (example)
```
{
  "results": [
    {
      "complaint_text": "انقطاع الكهرباء في المعادي",
      "solution_text": "عودة الكهرباء الساعة 8 مساءً",
      "similarity": 12
    }
  ]
}
```