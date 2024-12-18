-- Tao user trong oracle
CREATE USER xt IDENTIFIED BY xt; -- xac thuc
CREATE USER xd IDENTIFIED BY xd; -- xet duyet
CREATE USER lt IDENTIFIED BY lt; -- luu tru
CREATE USER gs IDENTIFIED BY gs; -- giam sat
CREATE USER cd IDENTIFIED BY cd; -- cu dan

-- Cap quyen dang nhap
GRANT CREATE SESSION TO xt;
GRANT CREATE SESSION TO xd;
GRANT CREATE SESSION TO lt;
GRANT CREATE SESSION TO gs;
GRANT CREATE SESSION TO cd;
GRANT UNLIMITED TABLESPACE TO xt;
GRANT UNLIMITED TABLESPACE TO xd;
GRANT UNLIMITED TABLESPACE TO lt;
GRANT UNLIMITED TABLESPACE TO gs;
GRANT UNLIMITED TABLESPACE TO cd;

-- Tao role
CREATE ROLE xacthuc;
CREATE ROLE xetduyet;
CREATE ROLE luutru;
CREATE ROLE giamsat;
CREATE ROLE cudan;

-- Cap role cho user
GRANT xacthuc TO xt;
GRANT xetduyet TO xd;
GRANT luutru TO lt;
GRANT giamsat TO gs;
GRANT cudan to cd;

-- Cấp quyền cho role giamsat
GRANT CREATE TABLE TO giamsat;
GRANT ALTER ANY TABLE TO giamsat;
GRANT DROP ANY TABLE TO giamsat;
GRANT EXECUTE ON DBMS_RLS TO giamsat;

GRANT CREATE PROCEDURE TO giamsat;
GRANT CREATE ANY PROCEDURE TO giamsat;
GRANT ALTER ANY PROCEDURE TO giamsat;
GRANT DROP ANY PROCEDURE TO giamsat;
GRANT EXECUTE ANY PROCEDURE TO giamsat;

GRANT CREATE ANY CONTEXT TO giamsat;
GRANT GRANT ANY PRIVILEGE TO giamsat;
GRANT GRANT ANY OBJECT PRIVILEGE TO giamsat;

-- use giamsat
connect gs/gs;

-- Tables
CREATE TABLE Citizen (
    id VARCHAR2(50) PRIMARY KEY,
    identity_id VARCHAR(50) NOT NULL,
    passport_id VARCHAR(50) NULL,

    family_name VARCHAR2(100) NOT NULL,
    given_name VARCHAR2(100) NOT NULL,
    dob DATE NOT NULL,
    sex VARCHAR2(10) NOT NULL,
    ethnicity VARCHAR2(50) NOT NULL,
    religion VARCHAR2(50),
    district_origin VARCHAR2(100) NOT NULL,
    city_origin VARCHAR2(100) NOT NULL,
    province_origin VARCHAR2(100) NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    pwd VARCHAR(255) NULL,

    CONSTRAINT fk_citizen_identity
        FOREIGN KEY (identity_id)
        REFERENCES CitizenIdentity(id),

    CONSTRAINT fk_citizen_passport
        FOREIGN KEY (passport_id)
        REFERENCES Passport(id)
)

CREATE TABLE CitizenIdentity (
    id VARCHAR2(50) PRIMARY KEY,
    issue_date DATE NOT NULL,
    expire_date DATE NOT NULL,
    identity_type VARCHAR2(5) CHECK (identity_type IN ('CMND', 'CCCD')),
    district_residence VARCHAR2(100) NOT NULL,
    city_residence VARCHAR2(100) NOT NULL,
    province_residence VARCHAR2(100) NOT NULL
)

CREATE TABLE Passport (
    id VARCHAR2(50) PRIMARY KEY,
    district_residence VARCHAR2(100) NOT NULL,
    city_residence VARCHAR2(100) NOT NULL,
    province_residence VARCHAR2(100) NOT NULL,
    issue_date DATE NOT NULL,
    expire_date DATE NOT NULL
)

CREATE TABLE PassportRegistrationAttempts (
    id VARCHAR2(50) PRIMARY KEY,
    citizen_id VARCHAR(50) NOT NULL,
    family_name VARCHAR2(100) NOT NULL,
    given_name VARCHAR2(100) NOT NULL,
    district_residence VARCHAR2(100) NOT NULL,
    city_residence VARCHAR2(100) NOT NULL,
    province_residence VARCHAR2(100) NOT NULL,
    identity_id VARCHAR2(50) NOT NULL,
    created_at DATE DEFAULT SYSDATE,
    accepted_at DATE NULL,
    verified_at DATE NULL,
    rejected_at DATE NULL,
    rejected_reason VARCHAR2(1000) NULL,
    
    CONSTRAINT fk_citizen
        FOREIGN KEY (citizen_id)
        REFERENCES Citizen(id)
)