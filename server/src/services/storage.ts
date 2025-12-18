import { BlobServiceClient } from '@azure/storage-blob';

const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_AUDIO || 'audio';

export function getBlobClient() {
  if (!conn) throw new Error('Storage connection missing');
  const service = BlobServiceClient.fromConnectionString(conn);
  return service.getContainerClient(containerName);
}

export async function uploadAudio(filename: string, buffer: Buffer, contentType = 'audio/mpeg') {
  const container = getBlobClient();
  await container.createIfNotExists();
  const block = container.getBlockBlobClient(filename);
  await block.uploadData(buffer, { blobHTTPHeaders: { blobContentType: contentType } });
  return block.url;
}
