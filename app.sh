#!/bin/bash

# Abre a api do backend em uma janela
qterminal -e "bash -c 'cd api/ && npm run start:dev; exec bash'" &

# Abre o frontend em outra nova janela
qterminal -e "bash -c 'cd frontend/ && npm run dev; exec bash'" &