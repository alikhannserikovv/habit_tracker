from datetime import timedelta, datetime, timezone
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Path
from fastapi.params import Depends
from sqlalchemy.orm import Session
from typing import Annotated
from starlette import status
from database import SessionLocal
from passlib.context import CryptContext
from schemas import CreateUserRequest, Token
from models import Users
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
import os

router = APIRouter(
    prefix='/users',
    tags=['Users']
)

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = 'HS256'

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='users/token')

#Validating the user
def fetch_authenticate_user(username: str, password: str, db):
    user_model = db.query(Users).filter(Users.username == username).first()
    if user_model is None or not bcrypt_context.verify(password, user_model.hashed_password):
        return False
    return user_model

def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    encode = {'sub': username, 'id': user_id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, ALGORITHM)

async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        username: str = payload.get('sub')
        user_id: int = payload.get('id')
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user")
        return {'username': username, 'id': user_id}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user")

@router.post('', status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, user_request: CreateUserRequest):
    if db.query(Users).filter(Users.username == user_request.username).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username is already taken")
    elif db.query(Users).filter(Users.email == user_request.email).first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already in use")
    user_model = Users(
        username = user_request.username,
        email = user_request.email,
        hashed_password = bcrypt_context.hash(user_request.password),
    )
    db.add(user_model)
    db.commit()

@router.delete('/{user_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(db: db_dependency, user_id: int = Path(gt=0)):
    user_model = db.query(Users).filter(Users.id == user_id).first()
    db.delete(user_model)
    db.commit()

@router.post('/token', response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                                 db: db_dependency):
    user = fetch_authenticate_user(form_data.username, form_data.password, db)
    if user is False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    token = create_access_token(user.username, user.id, timedelta(minutes=20))
    return {'access_token': token, 'token_type': 'bearer'}