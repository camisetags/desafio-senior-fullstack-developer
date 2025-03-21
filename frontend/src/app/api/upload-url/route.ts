import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'minio';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('fileName');
  const contentType = searchParams.get('contentType');
  
  try {
    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: 'fileName e contentType são obrigatórios' },
        { status: 400 }
      );
    }

    console.log('Processando solicitação de upload para arquivo:', fileName);

    const minioEndpoint = process.env.MINIO_ENDPOINT || 'minio';
    const minioPort = parseInt(process.env.MINIO_PORT || '9000');
    const minioUseSSL = process.env.MINIO_USE_SSL === 'true';
    const minioAccessKey = process.env.MINIO_ACCESS_KEY || 'minioadmin';
    const minioSecretKey = process.env.MINIO_SECRET_KEY || 'minioadmin';
    const minioBucket = process.env.NEXT_PUBLIC_MINIO_BUCKET_NAME || 'solicitacoes';
    
    console.log('Conectando ao MinIO:', {
      endPoint: minioEndpoint,
      port: minioPort,
      useSSL: minioUseSSL,
      bucket: minioBucket
    });

    const minioClient = new Client({
      endPoint: minioEndpoint,
      port: minioPort,
      useSSL: minioUseSSL,
      accessKey: minioAccessKey,
      secretKey: minioSecretKey,
    });
    

    let bucketExists = false;
    try {
      bucketExists = await minioClient.bucketExists(minioBucket);
      console.log(`Bucket ${minioBucket} existe:`, bucketExists);
      
      if (!bucketExists) {
        try {
          await minioClient.makeBucket(minioBucket, 'us-east-1');
          console.log(`Bucket ${minioBucket} criado com sucesso`);
          bucketExists = true;
          

          const policy = {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: { AWS: ['*'] },
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${minioBucket}/*`],
              },
            ],
          };
          
          await minioClient.setBucketPolicy(minioBucket, JSON.stringify(policy));
          console.log('Política de acesso público configurada para o bucket');
        } catch (e) {
          console.error('Erro ao criar bucket:', e);
          return NextResponse.json(
            { error: 'Não foi possível criar o bucket de armazenamento' },
            { status: 500 }
          );
        }
      }


      console.log('Gerando URL pré-assinada para:', fileName);
      const presignedUrl = await minioClient.presignedPutObject(
        minioBucket,
        fileName,
        60 * 10 
      );
      console.log('URL pré-assinada gerada:', presignedUrl);
      

      const publicEndpoint = process.env.NEXT_PUBLIC_MINIO_ENDPOINT || 'http://localhost:9000';
      const fileUrl = `${publicEndpoint}/${minioBucket}/${fileName}`;
      
      console.log('URL de acesso ao arquivo:', fileUrl);
      

      return NextResponse.json({ presignedUrl, fileUrl });
    } catch (error) {
      console.error('Erro ao interagir com o MinIO:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro ao gerar URL pré-assinada:', error);
    

    if (error instanceof Error && error.message.includes('connect ECONNREFUSED')) {
      console.log('Não foi possível conectar ao MinIO, usando fallback local');
      
      const fileName = searchParams.get('fileName');
      const presignedUrl = `/api/upload-mock?fileName=${encodeURIComponent(fileName || '')}&contentType=${encodeURIComponent(contentType || '')}`;
      const fileUrl = `/mock-files/${fileName}`;
      
      return NextResponse.json({ 
        presignedUrl, 
        fileUrl, 
        mock: true,
        error: 'MinIO não disponível, usando armazenamento local temporário' 
      });
    }
    
    return NextResponse.json(
      { error: 'Erro ao gerar URL para upload: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
