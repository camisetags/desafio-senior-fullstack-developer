import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error('Erro no mock de upload:', error);
    return new Response(null, { status: 500 });
  }
}
