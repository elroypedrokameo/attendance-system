import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { extname } from "path";

@Injectable()
export class R2StorageService {
  private readonly logger = new Logger(R2StorageService.name);
  private readonly s3Client: S3Client | null = null;
  private readonly bucketName: string;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService) {
    const accountId = this.config.get<string>("R2_ACCOUNT_ID");
    const accessKeyId = this.config.get<string>("R2_ACCESS_KEY_ID");
    const secretAccessKey = this.config.get<string>("R2_SECRET_ACCESS_KEY");
    this.bucketName = this.config.get<string>("R2_BUCKET_NAME", "");
    this.publicUrl = (
      this.config.get<string>(
        "R2_PUBLIC_URL",
        "https://pub-3bb62015a1cb4e9ab93e97e364f50098.r2.dev",
      ) || ""
    ).replace(/\/$/, "");

    if (accessKeyId && secretAccessKey) {
      const endpoint =
        this.config.get<string>("R2_ENDPOINT") ||
        `https://${accountId}.r2.cloudflarestorage.com`;

      this.s3Client = new S3Client({
        region: "auto",
        endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.logger.log(
        `Cloudflare R2 Storage initialized (bucket: ${this.bucketName})`,
      );
    } else {
      this.logger.warn(
        "R2 credentials not provided. Falling back to local storage.",
      );
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = "attendance",
  ): Promise<string> {
    const ext = extname(file.originalname).toLowerCase() || ".jpg";
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const key = `${folder}/wfh-${uniqueSuffix}${ext}`;

    if (!this.s3Client || !this.bucketName) {
      throw new InternalServerErrorException(
        "Cloudflare R2 Storage is not properly configured.",
      );
    }

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype || "image/jpeg",
      }),
    );

    return `${this.publicUrl}/${key}`;
  }
}

