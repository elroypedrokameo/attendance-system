import { Module } from "@nestjs/common";
import { StorageController } from "./storage.controller";
import { R2StorageService } from "./r2-storage.service";

@Module({
  controllers: [StorageController],
  providers: [R2StorageService],
  exports: [R2StorageService],
})
export class StorageModule {}
