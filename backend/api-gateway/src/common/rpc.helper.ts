import { BadRequestException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

export interface RpcResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export async function sendRpc<T = unknown>(
  client: ClientProxy,
  pattern: string,
  payload: unknown = {},
): Promise<RpcResponse<T>> {
  const result = await lastValueFrom(
    client.send<RpcResponse<T>>(pattern, payload),
  );

  if (result && result.success === false) {
    throw new BadRequestException(result.message || "Request failed");
  }

  return result;
}
