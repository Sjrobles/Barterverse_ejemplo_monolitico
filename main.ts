import { NestFactory } from '@nestjs/core';
import { Module, Controller, Post, Get, Body, Query, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ChromaClient } from 'chromadb';
import * as crypto from 'crypto';

// DTOs
class CreateProductDto {
  name: string = '';
  description: string = '';
}


// Servicio
@Injectable()
class ProductService {
  private chroma = new ChromaClient({ path: 'http://localhost:8000' }); 
  private collection: any;

  constructor() {
    this.init();
  }

  async init() {
  this.collection = await this.chroma.getOrCreateCollection({
    name: 'products',
    embeddingFunction: null,   
  });
}


  async createProduct(dto: CreateProductDto) {
    
    const response = await axios.post('http://localhost:8001/analyze', { text: dto.description });
    const embedding = response.data.embedding;

    const id = crypto.randomUUID();

    await this.collection.add({
      ids: [id],
      documents: [dto.description],
      metadatas: [{ name: dto.name }],
      embeddings: [embedding],
    });

    return { id, ...dto };
  }

  async searchSimilar(query: string) {
    // Embedding del query usando Python
    const response = await axios.post('http://localhost:8001/analyze', { text: query });
    const embedding = response.data.embedding;

    // Consulta en Chroma
    const results = await this.collection.query({
      queryEmbeddings: [embedding],
      nResults: 3,
    });

    return results;
  }
}

// Controlador
@Controller('products')
class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.productService.searchSimilar(query);
  }
}

// Módulo
@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log("🚀 NestJS corriendo en http://localhost:3000");
}
bootstrap();

