-- Tạo user
CREATE USER xt IDENTIFIED BY xt;
CREATE USER xd IDENTIFIED BY xd;
CREATE USER lt IDENTIFIED BY lt;
CREATE USER gs IDENTIFIED BY gs;

-- Cấp quyền tạo session
GRANT CREATE SESSION TO xt;
GRANT CREATE SESSION TO xd;
GRANT CREATE SESSION TO lt;
GRANT CREATE SESSION TO gs;
GRANT UNLIMITED TABLESPACE TO xt;
GRANT UNLIMITED TABLESPACE TO xd;
GRANT UNLIMITED TABLESPACE TO lt;
GRANT UNLIMITED TABLESPACE TO gs;

-- Cấp quyền tạo, sửa đổi, xóa table cho role giamsat
GRANT CREATE TABLE TO giamsat;
GRANT ALTER ANY TABLE TO giamsat;
GRANT DROP ANY TABLE TO giamsat;

-- Tạo role
CREATE ROLE xacthuc;
CREATE ROLE xetduyet;
CREATE ROLE luutru;
CREATE ROLE giamsat;

-- Cấp role cho user
GRANT xacthuc TO xt;
GRANT xetduyet TO xd;
GRANT luutru TO lt;
GRANT giamsat TO gs;

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

-- connect user gs
CONNECT gs/gs;

-- Tạo bảng
-- Create Citizen table
CREATE TABLE Citizen (
    id VARCHAR2(50) PRIMARY KEY,
    family_name VARCHAR2(100) NOT NULL,
    given_name VARCHAR2(100) NOT NULL,
    dob DATE NOT NULL,
    sex VARCHAR2(10) NOT NULL,
    ethnicity VARCHAR2(50) NOT NULL,
    religion VARCHAR2(50),
    district_origin VARCHAR2(100) NOT NULL,
    city_origin VARCHAR2(100) NOT NULL,
    province_origin VARCHAR2(100) NOT NULL
);

-- Create CitizenIdentity table
CREATE TABLE CitizenIdentity (
    id VARCHAR2(50) PRIMARY KEY,
    citizen_id VARCHAR2(50) NOT NULL,
    issue_date DATE NOT NULL,
    expire_date DATE NOT NULL,
    identity_type VARCHAR2(5) CHECK (identity_type IN ('CMND', 'CCCD')),
    district_residence VARCHAR2(100) NOT NULL,
    city_residence VARCHAR2(100) NOT NULL,
    province_residence VARCHAR2(100) NOT NULL,
    CONSTRAINT fk_citizen_identity
        FOREIGN KEY (citizen_id)
        REFERENCES Citizen(id)
);

-- Create Passport table
CREATE TABLE Passport (
    id VARCHAR2(50) PRIMARY KEY,
    citizen_id VARCHAR2(50) NOT NULL,
    citizen_identity_id VARCHAR2(50) NOT NULL,
    issue_date DATE NOT NULL,
    expire_date DATE NOT NULL,
    phone_number VARCHAR2(20) NOT NULL,
    CONSTRAINT fk_passport_citizen
        FOREIGN KEY (citizen_id)
        REFERENCES Citizen(id),
    CONSTRAINT fk_passport_identity
        FOREIGN KEY (citizen_identity_id)
        REFERENCES CitizenIdentity(id)
);

-- Create PassportRegistrationAttempts table
CREATE TABLE PassportRegistrationAttempts (
    id VARCHAR2(50) PRIMARY KEY,
    family_name VARCHAR2(100) NOT NULL,
    given_name VARCHAR2(100) NOT NULL,
    district_residence VARCHAR2(100) NOT NULL,
    city_residence VARCHAR2(100) NOT NULL,
    province_residence VARCHAR2(100) NOT NULL,
    phone_number VARCHAR2(20) NOT NULL,
    email VARCHAR2(100) NOT NULL,
    identity_id VARCHAR2(50) NOT NULL,
    accepted_at DATE NULL,
    verified_at DATE NULL,
    rejected_at DATE NULL,
    rejected_reason VARCHAR2(1000) NULL
);

-- Cấp quyền cho role xacthuc
GRANT SELECT ON Citizen TO xacthuc;
GRANT SELECT ON CitizenIdentity TO xacthuc;
GRANT SELECT ON Passport TO xacthuc;
GRANT SELECT, UPDATE ON PassportRegistrationAttempts TO xacthuc;

-- Cấp quyền cho role xetduyet
CREATE OR REPLACE FUNCTION xetduyet_citizen_func(
    schema_p IN VARCHAR2,
    table_p  IN VARCHAR2
) RETURN VARCHAR2
IS
BEGIN
    IF USER = 'XD' THEN
        RETURN '1=2';
    ELSE
        RETURN '1=1';
    END IF;
END xetduyet_citizen_func;

CREATE OR REPLACE FUNCTION xetduyet_passport_func(
    schema_p IN VARCHAR2,
    table_p  IN VARCHAR2
) RETURN VARCHAR2
IS
BEGIN
    IF USER = 'XD' THEN
        RETURN '1=2';
    ELSE
        RETURN '1=1';
    END IF;
END xetduyet_passport_func;

begin
	DBMS_RLS.ADD_POLICY(
	    object_schema    => 'GS',
	    object_name      => 'CITIZEN',
	    policy_name      => 'CITIZEN_XETDUYET_POLICY',
	    function_schema  => 'GS',
	    policy_function  => 'xetduyet_citizen_func',
	    sec_relevant_cols=> 'dob,sex,ethnicity,religion,district_origin,city_origin,province_origin',
	    sec_relevant_cols_opt => DBMS_RLS.ALL_ROWS
	);
END;

begin
	DBMS_RLS.ADD_POLICY(
        object_schema    => 'GS',
        object_name      => 'PASSPORT',
        policy_name      => 'PASSPORT_XETDUYET_POLICY',
        function_schema  => 'GS',
        policy_function  => 'xetduyet_passport_func',
        sec_relevant_cols=> 'citizen_identity_id,phone_number',
        sec_relevant_cols_opt => DBMS_RLS.ALL_ROWS
    );
END;

GRANT SELECT, UPDATE ON PassportRegistrationAttempts TO xetduyet;
GRANT SELECT ON CitizenIdentity TO xetduyet;
GRANT SELECT ON Citizen TO xetduyet;
GRANT SELECT ON Passport TO xetduyet;

-- Cấp quyền cho role luutru
GRANT SELECT ON PassportRegistrationAttempts TO luutru;
GRANT SELECT, INSERT ON Passport TO luutru;






