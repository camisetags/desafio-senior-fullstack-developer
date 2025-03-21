import { NextResponse } from 'next/server';
import { Client } from 'minio';


export async function GET() {
  try {

    console.log('Variáveis de ambiente do MinIO:');
    console.log('NEXT_PUBLIC_MINIO_ENDPOINT:', process.env.NEXT_PUBLIC_MINIO_ENDPOINT);
    console.log('MINIO_PORT:', process.env.MINIO_PORT);
    console.log('MINIO_USE_SSL:', process.env.MINIO_USE_SSL);
    console.log('MINIO_ACCESS_KEY:', process.env.MINIO_ACCESS_KEY ? '[definida]' : '[não definida]');
    console.log('MINIO_SECRET_KEY:', process.env.MINIO_SECRET_KEY ? '[definida]' : '[não definida]');
    console.log('NEXT_PUBLIC_MINIO_BUCKET_NAME:', process.env.NEXT_PUBLIC_MINIO_BUCKET_NAME);
    

    const minioEndpoint = process.env.NEXT_PUBLIC_MINIO_ENDPOINT?.replace('http://', '') || 'localhost';
    const minioPort = parseInt(process.env.MINIO_PORT || '9000');
    const minioUseSSL = process.env.MINIO_USE_SSL === 'true';
    const minioAccessKey = process.env.MINIO_ACCESS_KEY || 'minioadmin';
    const minioSecretKey = process.env.MINIO_SECRET_KEY || 'minioadmin';
    const minioBucket = process.env.NEXT_PUBLIC_MINIO_BUCKET_NAME || 'solicitacoes';
    
    const minioClient = new Client({
      endPoint: minioEndpoint,
      port: minioPort,
      useSSL: minioUseSSL,
      accessKey: minioAccessKey,
      secretKey: minioSecretKey,
    });
    
    const bucketExists = await minioClient.bucketExists(minioBucket);
    
    const buckets = await minioClient.listBuckets();
    
    return NextResponse.json({
      status: 'success',
      config: {
        endPoint: minioEndpoint,
        port: minioPort,
        useSSL: minioUseSSL,
        bucket: minioBucket
      },
      bucketExists,
      availableBuckets: buckets.map(b => b.name)
    });
  } catch (error) {
    console.error('Erro ao testar conexão com MinIO:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Não foi possível conectar ao MinIO',
        error: (error as Error).message,
        stack: (error as Error).stack
      },
      { status: 500 }
    );
  }
}
