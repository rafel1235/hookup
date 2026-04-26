import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- Importa ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aggiungi questa riga: Abilita il CORS per far passare il frontend!
  app.enableCors();

  // Configura la ValidationPipe globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Rimuove automaticamente le proprietà dal payload che non hanno decoratori nel DTO
      forbidNonWhitelisted: true, // Lancia un'eccezione se vengono inviate proprietà non previste nel DTO
      transform: true, // Trasforma automaticamente il payload in un'istanza della classe DTO
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
