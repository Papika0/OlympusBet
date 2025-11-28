import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Bootstrap the OlympusBet API server
 * 
 * As Zeus ignites the flames of Olympus, so too does this function
 * bring life to our backend services.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  app.enableCors();
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`
  ⚡ OlympusBet API Server is running!
  🏛️ Port: ${port}
  🌿 Environment: ${process.env.NODE_ENV || 'development'}
  `);
}

bootstrap();
