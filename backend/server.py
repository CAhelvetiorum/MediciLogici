from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import logging
import secrets
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Annotated

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, BeforeValidator, ConfigDict

# ---------------------------------------------------------------------------
# MongoDB
# ---------------------------------------------------------------------------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# ---------------------------------------------------------------------------
# Auth helpers
# ---------------------------------------------------------------------------
JWT_ALGORITHM = "HS256"

def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=8),
        "type": "access",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        try:
            user_oid = ObjectId(payload["sub"])
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"_id": user_oid})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["id"] = str(user["_id"])
        del user["_id"]
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return user

# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v) if isinstance(v, ObjectId) else v)]

class LoginRequest(BaseModel):
    email: str
    password: str

class DoctorBase(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    latin_name: Optional[str] = ""
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    dates_label: Optional[str] = ""
    nationality: Optional[str] = ""
    affiliations: Optional[List[str]] = Field(default_factory=list)
    biography: Optional[str] = ""
    logical_works: Optional[List[str]] = Field(default_factory=list)
    medical_works: Optional[List[str]] = Field(default_factory=list)
    notable_connections: Optional[List[str]] = Field(default_factory=list)
    sources: Optional[List[str]] = Field(default_factory=list)
    image_url: Optional[str] = ""

class DoctorCreate(DoctorBase):
    pass

class DoctorUpdate(DoctorBase):
    pass

class Doctor(DoctorBase):
    id: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


def doctor_from_mongo(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "name": doc.get("name", ""),
        "latin_name": doc.get("latin_name", ""),
        "birth_year": doc.get("birth_year"),
        "death_year": doc.get("death_year"),
        "dates_label": doc.get("dates_label", ""),
        "nationality": doc.get("nationality", ""),
        "affiliations": doc.get("affiliations", []),
        "biography": doc.get("biography", ""),
        "logical_works": doc.get("logical_works", []),
        "medical_works": doc.get("medical_works", []),
        "notable_connections": doc.get("notable_connections", []),
        "sources": doc.get("sources", []),
        "image_url": doc.get("image_url", ""),
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at"),
    }

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(title="Doctors-Logicians Research API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


@api_router.get("/")
async def root():
    return {"message": "Doctors-Logicians Research API"}


# ----- Auth -----
def _set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie("access_token", access_token, httponly=True, secure=True, samesite="none", max_age=8 * 3600, path="/")
    response.set_cookie("refresh_token", refresh_token, httponly=True, secure=True, samesite="none", max_age=7 * 24 * 3600, path="/")


@api_router.post("/auth/login")
async def login(payload: LoginRequest, response: Response):
    email = payload.email.strip().lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    user_id = str(user["_id"])
    access = create_access_token(user_id, email)
    refresh = create_refresh_token(user_id)
    _set_auth_cookies(response, access, refresh)
    return {
        "id": user_id,
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user.get("role", "admin"),
        "access_token": access,
    }


@api_router.post("/auth/logout")
async def logout(response: Response, _: dict = Depends(get_current_user)):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}


@api_router.get("/auth/me")
async def auth_me(user: dict = Depends(get_current_user)):
    return user


# ----- Doctors (Prosopography) -----
@api_router.get("/doctors", response_model=List[Doctor])
async def list_doctors(q: Optional[str] = None):
    query: dict = {}
    if q:
        query = {
            "$or": [
                {"name": {"$regex": q, "$options": "i"}},
                {"latin_name": {"$regex": q, "$options": "i"}},
                {"nationality": {"$regex": q, "$options": "i"}},
                {"biography": {"$regex": q, "$options": "i"}},
            ]
        }
    cursor = db.doctors.find(query).sort("name", 1)
    return [doctor_from_mongo(d) async for d in cursor]


@api_router.get("/doctors/{doctor_id}", response_model=Doctor)
async def get_doctor(doctor_id: str):
    try:
        oid = ObjectId(doctor_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Doctor not found")
    doc = await db.doctors.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor_from_mongo(doc)


@api_router.post("/doctors", response_model=Doctor)
async def create_doctor(payload: DoctorCreate, _: dict = Depends(require_admin)):
    now = datetime.now(timezone.utc).isoformat()
    doc = payload.model_dump()
    doc["created_at"] = now
    doc["updated_at"] = now
    result = await db.doctors.insert_one(doc)
    created = await db.doctors.find_one({"_id": result.inserted_id})
    return doctor_from_mongo(created)


@api_router.put("/doctors/{doctor_id}", response_model=Doctor)
async def update_doctor(doctor_id: str, payload: DoctorUpdate, _: dict = Depends(require_admin)):
    try:
        oid = ObjectId(doctor_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Doctor not found")
    update = payload.model_dump()
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.doctors.update_one({"_id": oid}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Doctor not found")
    updated = await db.doctors.find_one({"_id": oid})
    return doctor_from_mongo(updated)


@api_router.delete("/doctors/{doctor_id}")
async def delete_doctor(doctor_id: str, _: dict = Depends(require_admin)):
    try:
        oid = ObjectId(doctor_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Doctor not found")
    result = await db.doctors.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return {"ok": True}


# ----- Network (interactive HTML) -----
class NetworkPayload(BaseModel):
    html: str
    caption: Optional[str] = ""

@api_router.get("/network")
async def get_network():
    doc = await db.settings.find_one({"_id": "network"})
    if not doc:
        return {"html": "", "caption": ""}
    return {"html": doc.get("html", ""), "caption": doc.get("caption", "")}


@api_router.put("/network")
async def set_network(payload: NetworkPayload, _: dict = Depends(require_admin)):
    await db.settings.update_one(
        {"_id": "network"},
        {"$set": {"html": payload.html, "caption": payload.caption, "updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True,
    )
    return {"ok": True}


app.include_router(api_router)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
cors_origins = os.environ.get("CORS_ORIGINS", "*")
if cors_origins == "*":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[o.strip() for o in cors_origins.split(",") if o.strip()],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# ---------------------------------------------------------------------------
# Startup: seed admin & indexes
# ---------------------------------------------------------------------------
async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one(
            {
                "email": admin_email,
                "password_hash": hash_password(admin_password),
                "name": "Administrator",
                "role": "admin",
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
        )
        logger.info("Seeded admin user: %s", admin_email)
    else:
        if not verify_password(admin_password, existing["password_hash"]):
            await db.users.update_one(
                {"email": admin_email},
                {"$set": {"password_hash": hash_password(admin_password)}},
            )
            logger.info("Updated admin password for: %s", admin_email)


async def seed_initial_doctors():
    if await db.doctors.count_documents({}) > 0:
        return
    now = datetime.now(timezone.utc).isoformat()
    seed = [
        {
            "name": "Jacopo Zabarella",
            "latin_name": "Iacobus Zabarella",
            "birth_year": 1533,
            "death_year": 1589,
            "dates_label": "1533–1589",
            "nationality": "Italian",
            "affiliations": ["University of Padua"],
            "biography": "Italian Aristotelian philosopher and logician at Padua, whose treatises on method (regressus) shaped the methodological reflection of physicians trained in the Paduan school.",
            "logical_works": ["Opera logica (1578)", "De methodis (1578)", "De regressu"],
            "medical_works": [],
            "notable_connections": ["Galileo Galilei", "Cesare Cremonini"],
            "sources": ["Mikkeli, H. (1992). An Aristotelian Response to Renaissance Humanism."],
            "image_url": "",
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Sanctorius Sanctorius",
            "latin_name": "Santorio Santori",
            "birth_year": 1561,
            "death_year": 1636,
            "dates_label": "1561–1636",
            "nationality": "Italian",
            "affiliations": ["University of Padua"],
            "biography": "Venetian physician, founder of quantitative iatromechanics; his Methodi vitandorum errorum (1603) is a sustained application of logical method to medicine.",
            "logical_works": ["Methodi vitandorum errorum (1603)"],
            "medical_works": ["De statica medicina (1614)"],
            "notable_connections": ["Galileo Galilei", "Fabricius ab Aquapendente"],
            "sources": ["Bigotti, F. (2019). Physiology of the Soul."],
            "image_url": "",
            "created_at": now,
            "updated_at": now,
        },
        {
            "name": "Daniel Sennert",
            "latin_name": "Daniel Sennertus",
            "birth_year": 1572,
            "death_year": 1637,
            "dates_label": "1572–1637",
            "nationality": "German",
            "affiliations": ["University of Wittenberg"],
            "biography": "Wittenberg physician and natural philosopher who deployed a Aristotelian-corpuscular logic in his medical works, mediating between scholastic logic and emerging chymistry.",
            "logical_works": ["Epitome naturalis scientiae (1618)"],
            "medical_works": ["Institutionum medicinae libri V (1611)"],
            "notable_connections": ["Andreas Libavius"],
            "sources": ["Newman, W. R. (2006). Atoms and Alchemy."],
            "image_url": "",
            "created_at": now,
            "updated_at": now,
        },
    ]
    await db.doctors.insert_many(seed)
    logger.info("Seeded %d initial doctors", len(seed))


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await seed_admin()
    await seed_initial_doctors()


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
