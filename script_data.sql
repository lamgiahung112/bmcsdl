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
    created_at DATE DEFAULT SYSDATE
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

-- XT chỉ dc select thông tin nào mà accepted_at là NULL
-- Tạo function cho policy của xacthuc
CREATE OR REPLACE FUNCTION xacthuc_attempts_func(
    schema_p IN VARCHAR2,
    table_p  IN VARCHAR2
) RETURN VARCHAR2
IS
BEGIN
    IF USER = 'XT' THEN
        RETURN 'accepted_at IS NULL';
    ELSE
        RETURN '1=1';
    END IF;
END xacthuc_attempts_func;

-- Thêm policy cho role xacthuc
BEGIN
    DBMS_RLS.ADD_POLICY(
        object_schema    => 'GS',
        object_name      => 'PASSPORTREGISTRATIONATTEMPTS',
        policy_name      => 'ATTEMPTS_XACTHUC_POLICY',
        function_schema  => 'GS',
        policy_function  => 'xacthuc_attempts_func',
        statement_types  => 'SELECT'
    );
END;

-- XT chỉ được update verified_at, rejected_at và rejected_reason
-- Tạo function cho policy giới hạn update của xacthuc
CREATE OR REPLACE FUNCTION xacthuc_attempts_update_func(
    schema_p IN VARCHAR2,
    table_p  IN VARCHAR2
) RETURN VARCHAR2
IS
BEGIN
    IF USER = 'XT' THEN
        RETURN 'accepted_at IS NULL';
    ELSE
        RETURN '1=1';
    END IF;
END xacthuc_attempts_update_func;

-- Thêm policy giới hạn update cho role xacthuc
BEGIN
    DBMS_RLS.ADD_POLICY(
        object_schema    => 'GS',
        object_name      => 'PASSPORTREGISTRATIONATTEMPTS',
        policy_name      => 'ATTEMPTS_XACTHUC_UPDATE_POLICY',
        function_schema  => 'GS',
        policy_function  => 'xacthuc_attempts_update_func',
        statement_types  => 'UPDATE',
        sec_relevant_cols=> 'verified_at,rejected_at,rejected_reason'
    );
END;

-- XD chỉ được select thông tin verified_at khác NULL
-- Tạo function cho policy của xetduyet
CREATE OR REPLACE FUNCTION xetduyet_attempts_func(
    schema_p IN VARCHAR2,
    table_p  IN VARCHAR2
) RETURN VARCHAR2
IS
BEGIN
    IF USER = 'XD' THEN
        RETURN 'verified_at IS NOT NULL';
    ELSE
        RETURN '1=1';
    END IF;
END xetduyet_attempts_func;

-- Thêm policy cho role xetduyet
BEGIN
    DBMS_RLS.ADD_POLICY(
        object_schema    => 'GS',
        object_name      => 'PASSPORTREGISTRATIONATTEMPTS',
        policy_name      => 'ATTEMPTS_XETDUYET_POLICY',
        function_schema  => 'GS',
        policy_function  => 'xetduyet_attempts_func',
        statement_types  => 'SELECT'
    );
END;

-- XD chỉ được update accepted_at , rejected_at và rejected_reason
-- Tạo function cho policy giới hạn update của xetduyet
CREATE OR REPLACE FUNCTION xetduyet_attempts_update_func(
    schema_p IN VARCHAR2,
    table_p  IN VARCHAR2
) RETURN VARCHAR2
IS
BEGIN
    IF USER = 'XD' THEN
        RETURN 'verified_at IS NOT NULL';
    ELSE
        RETURN '1=1';
    END IF;
END xetduyet_attempts_update_func;

-- Thêm policy giới hạn update cho role xetduyet
BEGIN
    DBMS_RLS.ADD_POLICY(
        object_schema    => 'GS',
        object_name      => 'PASSPORTREGISTRATIONATTEMPTS',
        policy_name      => 'ATTEMPTS_XETDUYET_UPDATE_POLICY',
        function_schema  => 'GS',
        policy_function  => 'xetduyet_attempts_update_func',
        statement_types  => 'UPDATE',
        sec_relevant_cols=> 'accepted_at,rejected_at,rejected_reason'
    );
END;

-- LT chỉ được select thông tin accepted_at , verified_at cả 2 khác NULL
-- Tạo function cho policy của luutru
CREATE OR REPLACE FUNCTION luutru_attempts_func(
    schema_p IN VARCHAR2,
    table_p  IN VARCHAR2
) RETURN VARCHAR2
IS
BEGIN
    IF USER = 'LT' THEN
        RETURN 'accepted_at IS NOT NULL AND verified_at IS NOT NULL';
    ELSE
        RETURN '1=1';
    END IF;
END luutru_attempts_func;

-- Thêm policy cho role luutru
BEGIN
    DBMS_RLS.ADD_POLICY(
        object_schema    => 'GS',
        object_name      => 'PASSPORTREGISTRATIONATTEMPTS',
        policy_name      => 'ATTEMPTS_LUUTRU_POLICY',
        function_schema  => 'GS',
        policy_function  => 'luutru_attempts_func',
        statement_types  => 'SELECT'
    );
END;

-- LT được insert Passport
-- Cấp quyền cho role luutru
GRANT SELECT ON PassportRegistrationAttempts TO luutru;
GRANT SELECT, INSERT ON Passport TO luutru;

---Insert data 
-- tool manager data table
DELETE FROM Citizen;
COMMIT;
--Ưu điểm: Có thể hoàn tác (ROLLBACK) nếu bạn chưa COMMIT.

-- Thêm các dòng dữ liệu cố định pass
-- INSERT ALL
--   INTO Citizen (id, family_name, given_name, dob, sex, ethnicity, religion, district_origin, city_origin, province_origin) 
--   VALUES ('C001', 'Nguyen', 'An', TO_DATE('01-01-1990', 'DD-MM-YYYY'), 'Nam', 'Kinh', 'Không', 'Thanh Xuan', 'Ha Noi', 'Ha Noi')
--   INTO Citizen (id, family_name, given_name, dob, sex, ethnicity, religion, district_origin, city_origin, province_origin) 
--   VALUES ('C002', 'Tran', 'Binh', TO_DATE('05-05-1988', 'DD-MM-YYYY'), 'Nam', 'Kinh', 'Phật giáo', 'Dong Da', 'Ha Noi', 'Ha Noi')
--   INTO Citizen (id, family_name, given_name, dob, sex, ethnicity, religion, district_origin, city_origin, province_origin) 
--   VALUES ('C003', 'Le', 'Chau', TO_DATE('15-07-1992', 'DD-MM-YYYY'), 'Nữ', 'Kinh', 'Công giáo', 'Tan Binh', 'Ho Chi Minh', 'Ho Chi Minh')
--   INTO Citizen (id, family_name, given_name, dob, sex, ethnicity, religion, district_origin, city_origin, province_origin) 
--   VALUES ('C004', 'Pham', 'Dung', TO_DATE('20-03-1985', 'DD-MM-YYYY'), 'Nam', 'Kinh', 'Không', 'Cai Rang', 'Can Tho', 'Can Tho')
--   INTO Citizen (id, family_name, given_name, dob, sex, ethnicity, religion, district_origin, city_origin, province_origin) 
--   VALUES ('C005', 'Hoang', 'Hanh', TO_DATE('30-12-1994', 'DD-MM-YYYY'), 'Nữ', 'Kinh', 'Không', 'Son Tra', 'Da Nang', 'Da Nang')
-- SELECT * FROM DUAL;


connect sys/bmcsdl;
---loop insert 100row 
DECLARE
    -- Arrays for Vietnamese names and locations
    TYPE name_array IS VARRAY(20) OF VARCHAR2(100);
    
    family_names name_array := name_array('Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng');
    given_names_male name_array := name_array('Văn An', 'Hoàng Nam', 'Minh Đức', 'Quang Huy', 'Thành Công', 'Việt Anh', 'Đức Tài', 'Bảo Long', 'Minh Quân', 'Hữu Phước');
    given_names_female name_array := name_array('Thị Bình', 'Thùy Linh', 'Ngọc Anh', 'Thanh Hà', 'Mai Hương', 'Thúy Kiều', 'Mỹ Duyên', 'Phương Thảo', 'Bích Ngọc', 'Kim Anh');
    ethnicity name_array := name_array ('Kinh', 'Tày', 'Chăm', 'Hoa', 'Kinh', 'Kinh', 'Hmong', 'Thái', 'Nùng', 'Kinh');
    districts name_array := name_array('Hoàn Kiếm', 'Ba Đình', 'Đống Đa', 'Hai Bà Trưng', 'Hoàng Mai', 'Thanh Xuân', 'Cầu Giấy', 'Quận 1', 'Quận 3', 'Hải Châu');
    cities name_array := name_array('Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Biên Hòa', 'Nha Trang', 'Huế', 'Đà Lạt', 'Vũng Tàu');
    religions name_array := name_array('Không', 'Phật giáo', 'Công giáo', 'Cao Đài', 'Hòa Hảo', 'Tin Lành', 'Không', 'Phật giáo', 'Không', 'Không');
    
    v_id VARCHAR2(8);
    v_sex VARCHAR2(10);
    v_family_name VARCHAR2(100);
    v_given_name VARCHAR2(100);
    v_dob DATE;
    v_district VARCHAR2(100);
    v_city VARCHAR2(100);
    v_ethnicity VARCHAR2(100);
    v_religion VARCHAR2(100);
    v_issue_date DATE;
    v_expire_date DATE;
BEGIN
    -- Insert 100 citizens
    FOR i IN 1..100 LOOP
        -- Generate basic data
        v_id := 'CTZ' || LPAD(i, 5, '0');
        v_sex := CASE WHEN DBMS_RANDOM.VALUE < 0.5 THEN 'Nam' ELSE 'Nữ' END;
        v_family_name := family_names(TRUNC(DBMS_RANDOM.VALUE(1, 11)));
        v_dob := TO_DATE('1960-01-01', 'YYYY-MM-DD') + TRUNC(DBMS_RANDOM.VALUE(0, 365*40));
        
        -- Select given name based on gender
        IF v_sex = 'Nam' THEN
            v_given_name := given_names_male(TRUNC(DBMS_RANDOM.VALUE(1, 11)));
        ELSE
            v_given_name := given_names_female(TRUNC(DBMS_RANDOM.VALUE(1, 11)));
        END IF;
        
        -- Select random locations and religion
        v_district := districts(TRUNC(DBMS_RANDOM.VALUE(1, 11)));
        v_city := cities(TRUNC(DBMS_RANDOM.VALUE(1, 11)));
        v_ethnicity := ethnicity(TRUNC(DBMS_RANDOM.VALUE(1, 11)));
        v_religion := religions(TRUNC(DBMS_RANDOM.VALUE(1, 11)));
        
        -- Calculate identity document dates
        v_issue_date := ADD_MONTHS(v_dob, 216 + TRUNC(DBMS_RANDOM.VALUE(0, 240))); -- 18 years + random months
        v_expire_date := ADD_MONTHS(v_issue_date, 180); -- 15 years after issue

        -- Insert citizen
        INSERT INTO citizen VALUES (
            v_id,
            v_family_name,
            v_given_name,
            v_dob,
            v_sex,
            v_ethnicity,
            v_religion,
            v_district,
            v_city,
            v_city
        );

        -- Insert corresponding identity document
        INSERT INTO citizenidentity VALUES (
            'ID' || LPAD(i, 6, '0'),
            v_id,
            v_issue_date,
            v_expire_date,
            CASE WHEN DBMS_RANDOM.VALUE < 0.7 THEN 'CCCD' ELSE 'CMND' END,
            districts(TRUNC(DBMS_RANDOM.VALUE(1, 11))),
            districts(TRUNC(DBMS_RANDOM.VALUE(1, 11))),
            cities(TRUNC(DBMS_RANDOM.VALUE(1, 11)))
        );
        
    END LOOP;
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        ROLLBACK;
END;


