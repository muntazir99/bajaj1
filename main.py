from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # Adjust if your frontend runs on a different port
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


app = FastAPI()
origins = [
    "http://localhost:3000",  # Adjust if your frontend runs on a different port
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    # Add other allowed origins here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class DataRequest(BaseModel):
    data: List[str]

from typing import List, Optional

class DataResponse(BaseModel):
    is_success: bool
    user_id: str
    email: str
    roll_number: str
    numbers: List[str]
    alphabets: List[str]
    highest_alphabet: Optional[List[str]]  # Change to list of strings


@app.post("/bfhl/data", response_model=DataResponse)
def process_data(request: DataRequest):
    try:
        numbers = [item for item in request.data if item.isdigit()]
        alphabets = [item for item in request.data if item.isalpha()]
        highest_alphabet = [max(alphabets, key=lambda x: x.lower(), default=None)]
        return DataResponse(
            is_success=True,
            user_id="john_doe_17091999",
            email="john@xyz.com",
            roll_number="ABCD123",
            numbers=numbers,
            alphabets=alphabets,
            highest_alphabet=highest_alphabet if highest_alphabet[0] else []
        )
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")



@app.get("/bfhl/operation_code")
def get_operation_code():
    return {"operation_code": "XYZ123"}

@app.get("/")
def read_root():
    return {"message": "Welcome to BFHL!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
