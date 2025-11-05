import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    if (!role) {
      return NextResponse.json({ error: 'Role parameter is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('petugas2')
      .select('id, nama, jenis')
      .eq('jenis', role.toUpperCase());

    if (error) {
      console.error('Error fetching staff:', error);
      return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
    }

    return NextResponse.json({ staff: data });
  } catch (error) {
    console.error('Error in staff API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
