import {
  Controller,
  Get,
  Param,
  Res,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { Response } from "express";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { R2StorageService } from "./r2-storage.service";

@ApiTags("Storage")
@Controller("storage")
export class StorageController {
  constructor(private readonly r2StorageService: R2StorageService) {}

  @Get(":folder/:filename")
  @ApiOperation({ summary: "Proxy and stream image directly from Cloudflare R2" })
  async getFile(
    @Param("folder") folder: string,
    @Param("filename") filename: string,
    @Res() res: Response,
  ) {
    if (!/^[a-zA-Z0-9_-]+$/.test(folder) || !/^[a-zA-Z0-9_.-]+$/.test(filename)) {
      throw new BadRequestException("Invalid file path");
    }

    try {
      const key = `${folder}/${filename}`;
      const file = await this.r2StorageService.getFile(key);

      res.setHeader("Content-Type", file.contentType);
      if (file.contentLength) {
        res.setHeader("Content-Length", file.contentLength);
      }
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

      file.stream.pipe(res);
    } catch (err: unknown) {
      const s3Error = err as {
        name?: string;
        $metadata?: { httpStatusCode?: number };
      };
      if (
        s3Error?.name === "NoSuchKey" ||
        s3Error?.$metadata?.httpStatusCode === 404
      ) {
        throw new NotFoundException("Image not found");
      }
      throw err;
    }
  }
}

