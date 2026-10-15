import { NextResponse } from 'next/server';
import { DEFAULT_MENU } from '@/lib/menu-data';

export async function GET() {
  try {
    return NextResponse.json({
      status: 'success',
      version: 'v7-poster-83',
      totalItems: DEFAULT_MENU.length,
      menu: DEFAULT_MENU,
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      status: 'success',
      message: 'Menu payload received and processed',
      timestamp: new Date().toISOString(),
      itemCount: Array.isArray(body?.menu) ? body.menu.length : 0,
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
