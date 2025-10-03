# Barterverse_ejemplo_monolitico
Este repositorio surge con la finalidad de hacer un ejemplo monolitico de la aplicación de trueques, haciendo uso de chromaDB, libreria transformers para python, nestJS, solo backend.


```bash
pip install fastapi uvicorn transformers keybert sentence-transformers chromadb

#levantar python
uvicorn nlp:app --reload --port 8001
#levantar chroma
chroma run --path ./chroma_db
#levantar Nest
npx ts-node main.ts


#Probar en POSTMAN
POST
http://localhost:3000/products

Ejemplo 1:
{
  "name": "Bicicleta de montaña",
  "description": "Bicicleta azul en buen estado para terrenos difíciles"
}

Ejemplo 2:

{
  "name": "Bicicleta de calle",
  "description": "Asquerosa Bicicleta"
}


GET
http://localhost:3000/products/search?q=bicicleta usada campo


Respuesta esperada:

{
    "distances": [
        [
            0.7602162,
            0.83258206
        ]
    ],
    "documents": [
        [
            "Bicicleta azul en buen estado para terrenos difíciles",
            "Asquerosa Bicicleta"
        ]
    ],
    "embeddings": [],
    "ids": [
        [
            "616b3e9c-4f22-4d49-9cd4-19adfc0492a2",
            "07e3a83f-32cd-4947-8cdb-d64860f8bf50"
        ]
    ],
    "include": [
        "metadatas",
        "documents",
        "distances"
    ],
    "metadatas": [
        [
            {
                "name": "Bicicleta de montaña"
            },
            {
                "name": "Bicicleta de calle"
            }
        ]
    ],
    "uris": []
}

