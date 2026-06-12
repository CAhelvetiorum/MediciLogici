"""Backend regression tests for Doctors-Logicians Research API."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@research.local"
ADMIN_PASSWORD = "changeMe-2026!"


@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    data = r.json()
    assert data.get("role") == "admin"
    assert data.get("access_token")
    return data["access_token"]


@pytest.fixture
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ---- Auth ----
def test_login_success():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    body = r.json()
    assert "access_token" in body and body["role"] == "admin"


def test_login_invalid():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
    assert r.status_code == 401


def test_auth_me_requires_token():
    r = requests.get(f"{API}/auth/me")
    assert r.status_code == 401


def test_auth_me_with_token(admin_headers):
    r = requests.get(f"{API}/auth/me", headers=admin_headers)
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL


# ---- Doctors public ----
def test_list_doctors_returns_seed():
    r = requests.get(f"{API}/doctors")
    assert r.status_code == 200
    data = r.json()
    names = [d["name"] for d in data]
    assert "Jacopo Zabarella" in names
    assert "Sanctorius Sanctorius" in names
    assert "Daniel Sennert" in names


def test_get_doctor_detail():
    r = requests.get(f"{API}/doctors")
    first_id = r.json()[0]["id"]
    detail = requests.get(f"{API}/doctors/{first_id}")
    assert detail.status_code == 200
    assert detail.json()["id"] == first_id


def test_get_doctor_invalid_id():
    r = requests.get(f"{API}/doctors/nonexistent-id-xyz")
    assert r.status_code == 404


# ---- Doctors protected CRUD ----
def test_post_doctors_requires_auth():
    r = requests.post(f"{API}/doctors", json={"name": "X"})
    assert r.status_code == 401


def test_full_doctor_crud(admin_headers):
    # create
    payload = {"name": "TEST_Doctor", "latin_name": "TEST", "birth_year": 1600, "death_year": 1670,
               "dates_label": "1600-1670", "nationality": "Italian", "biography": "Tester."}
    r = requests.post(f"{API}/doctors", json=payload, headers=admin_headers)
    assert r.status_code == 200, r.text
    created = r.json()
    did = created["id"]
    assert created["name"] == "TEST_Doctor"

    # get
    g = requests.get(f"{API}/doctors/{did}")
    assert g.status_code == 200
    assert g.json()["name"] == "TEST_Doctor"

    # update
    upd = dict(payload, name="TEST_Doctor_Updated", biography="Updated bio.")
    u = requests.put(f"{API}/doctors/{did}", json=upd, headers=admin_headers)
    assert u.status_code == 200
    assert u.json()["name"] == "TEST_Doctor_Updated"

    # verify persisted
    g2 = requests.get(f"{API}/doctors/{did}")
    assert g2.json()["biography"] == "Updated bio."

    # update without auth
    u2 = requests.put(f"{API}/doctors/{did}", json=upd)
    assert u2.status_code == 401

    # delete without auth
    d0 = requests.delete(f"{API}/doctors/{did}")
    assert d0.status_code == 401

    # delete
    d = requests.delete(f"{API}/doctors/{did}", headers=admin_headers)
    assert d.status_code == 200

    # verify gone
    gone = requests.get(f"{API}/doctors/{did}")
    assert gone.status_code == 404


# ---- Network ----
def test_network_get_public():
    r = requests.get(f"{API}/network")
    assert r.status_code == 200
    body = r.json()
    assert "html" in body and "caption" in body


def test_network_put_requires_auth():
    r = requests.put(f"{API}/network", json={"html": "x", "caption": "y"})
    assert r.status_code == 401


def test_network_put_and_get(admin_headers):
    payload = {"html": "<html><body>hello</body></html>", "caption": "Test caption"}
    r = requests.put(f"{API}/network", json=payload, headers=admin_headers)
    assert r.status_code == 200
    g = requests.get(f"{API}/network")
    assert g.status_code == 200
    body = g.json()
    assert body["html"] == payload["html"]
    assert body["caption"] == payload["caption"]
