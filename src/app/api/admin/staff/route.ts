import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: staff, error } = await supabase
      .from('petugas2')
      .select('*')
      .order('nama', { ascending: true });

    if (error) {
      console.error('Error fetching staff:', error);
      return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
    }

    return NextResponse.json({ staff: staff || [] });
  } catch (error) {
    console.error('Error in staff API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
