$env:MONGODB_URI="mongodb://localhost:27017/mealplanr"
$env:JWT_SECRET="super-secret-key-change-me"
$env:JWT_EXPIRES_IN="60"
$env:PYTHONPATH="."
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

