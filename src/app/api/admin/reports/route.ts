import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type || !['morning', 'afternoon'].includes(type)) {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    const tableName = type === 'morning' ? 'morning_reports' : 'afternoon_reports';

    const { data: reports, error } = await supabase
      .from(tableName)
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
    }

    return NextResponse.json({ reports: reports || [] });
  } catch (error) {
    console.error('Error in reports API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
