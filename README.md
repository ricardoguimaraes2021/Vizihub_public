# Vizihub_PDS

## Description
Vizihub_PDS is a project built using the Laravel framework. It includes a backend powered by Laravel and a frontend that uses Node.js and npm for package management.

## Requirements
- Wamp
- Node.js
- Composer
- PHP ^7.3|^8.0

## Installation

### Backend
1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```sh
    cd Vizihub_PDS
    ```
3. Install the PHP dependencies:
    ```sh
    composer install
    ```

### Frontend
1. Navigate to the frontend directory:
    ```sh
    cd frontend
    ```
2. Install the Node.js dependencies:
    ```sh
    npm install
    ```

## Usage

### Backend
1. Start the Laravel development server:
    ```sh
    php artisan serve
    ```

### Frontend
1. Build and start the frontend:
    ```sh
    npm run dev
    ```

## Configuration
1. Copy the `.env.example` file to `.env` and configure your environment variables:
    ```sh
    cp .env.example .env
    ```
2. Generate the application key:
    ```sh
    php artisan key:generate
    ```

