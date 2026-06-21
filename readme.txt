Inventory & Order Management System
A full-stack inventory, customer, and order management application. Built with a React + Tailwind CSS frontend and a FastAPI + PostgreSQL backend, with a clean REST API for managing products, customers, and orders and automatic stock tracking.
Overview
This application lets a business track its product catalog, manage customer records, and process orders — while automatically keeping stock levels accurate. When an order is placed, the system checks that enough stock is available for every item before saving anything, then updates inventory in one atomic operation so the data never ends up in a broken state.
Features
Product Management

Create, update, delete, and list products
Tracks SKU, price, and stock quantity
Prevents duplicate SKUs

Customer Management

Create, update, delete, and list customers
Tracks full name, email, and phone number
Prevents duplicate customer emails

Order Management

Place multi-item orders for a customer in a single request
Validates that the customer and every product in the order actually exist
Checks stock availability for each item before confirming the order
Automatically deducts ordered quantities from stock
Blocks deleting a product if it's already used in an order, to protect order history

Dashboard

Live summary cards for total products, customers, and orders
Low-stock alerts for products running out
Revenue chart showing order trends
Visual stock gauges showing how full or low each product's inventory is

UI/UX

Responsive layout with a sidebar (desktop) and mobile navigation
Modal-based forms for adding/editing products, customers, and orders
Toast notifications for success and error feedback

Tech Stack
Frontend

React 19, Vite, Tailwind CSS, React Router, Axios, React Hot Toast, Lucide Icons
Backend

FastAPI, SQLAlchemy 2.0, PostgreSQL, Pydantic v2, Alembic
Project Architecture (Backend)
The backend follows a clean, layered structure:

models — SQLAlchemy ORM models (Product, Customer, Order, OrderItem)
schemas — Pydantic schemas for request/response validation
crud — business logic and database access, kept separate from the API layer
routers — FastAPI route handlers per resource
core — app configuration and custom exceptions (NotFoundError, ConflictError, InsufficientStockError)

This separation keeps validation, business rules, and routing independent, making the codebase easier to test and extend.
API Endpoints
Products

GET /products

POST /products

GET /products/{id}

PUT /products/{id}

DELETE /products/{id}
Customers

GET /customers

POST /customers

GET /customers/{id}

PUT /customers/{id}

DELETE /customers/{id}
Orders

GET /orders

POST /orders

GET /orders/{id}

DELETE /orders/{id}
Order creation validates the customer and every product, checks stock per item, then atomically creates the order and decrements inventory. Returns 404 if a customer or product doesn't exist, and 409 if stock is insufficient or there's a SKU/email conflict.
Interactive API docs are available at /docs once the backend is running.
Getting Started
Prerequisites

Node.js 18+

Python 3.11+

PostgreSQL
Backend Setup

cd backend

python -m venv venv

source venv/bin/activate 

pip install -r requirements.txt

cp .env.example .env 

uvicorn app.main:app --reload
Runs at http://127.0.0.1:8000

cd frontend
npm install
npm run dev
