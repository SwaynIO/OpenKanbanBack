#!/bin/bash

# Installation des dépendances backend
echo "Installing backend dependencies..."
npm install

# Création du fichier .env si non existant
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    echo "DB_HOST=localhost" > .env
    echo "DB_USER=root" >> .env
    echo "DB_PASSWORD=yourpassword" >> .env
    echo "DB_NAME=my_database" >> .env
    echo "JWT_SECRET=mysecret" >> .env
fi

echo "Backend setup complete!"
