CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('superuser', 'admin', 'system_user')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Brands (
    brand_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Cars (
    car_id SERIAL PRIMARY KEY,
    brand_id INTEGER REFERENCES Brands(brand_id) ON DELETE CASCADE,
    model VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL,
    condition VARCHAR(20) NOT NULL CHECK (condition IN ('new', 'used')),
    year INTEGER NOT NULL
);

CREATE TABLE Ads (
    ad_id SERIAL PRIMARY KEY,
    car_id INTEGER REFERENCES Cars(car_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES Users(user_id) ON DELETE CASCADE,
    price DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Transactions (
    transaction_id SERIAL PRIMARY KEY,
    car_id INTEGER REFERENCES Cars(car_id) ON DELETE CASCADE,
    buyer_id INTEGER REFERENCES Users(user_id) ON DELETE CASCADE,
    seller_id INTEGER REFERENCES Users(user_id) ON DELETE CASCADE,
    price DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data
INSERT INTO Users (mobile, password, role) VALUES
('09123456789', '$2b$10$examplehashedpassword123', 'superuser'),
('09123456790', '$2b$10$examplehashedpassword456', 'admin'),
('09123456791', '$2b$10$examplehashedpassword789', 'system_user');

INSERT INTO Brands (name) VALUES
('Toyota'),
('BMW'),
('Hyundai');

INSERT INTO Cars (brand_id, model, color, condition, year) VALUES
(1, 'Camry', 'Black', 'new', 2023),
(1, 'Corolla', 'White', 'used', 2020),
(2, 'X5', 'Blue', 'new', 2022),
(3, 'Tucson', 'Red', 'used', 2019);

INSERT INTO Ads (car_id, user_id, price) VALUES
(1, 3, 25000.00),
(2, 3, 18000.00),
(3, 3, 45000.00);