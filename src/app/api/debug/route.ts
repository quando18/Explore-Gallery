import { NextRequest, NextResponse } from 'next/server';
import { getStorageInfo } from '@/lib/persistentStorage';

export async function GET(request: NextRequest) {
  const info = getStorageInfo();
  
  return NextResponse.json({
    success: true,
    data: info,
    message: 'Storage debug info'
  });
}