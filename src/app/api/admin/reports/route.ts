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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !['morning', 'afternoon'].includes(type)) {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
    }

    const tableName = type === 'morning' ? 'morning_reports' : 'afternoon_reports';
    const sheetName = type === 'morning' ? 'MORNING' : 'AFTERNOON';

    // First, get the report to get the timestamp for sheets deletion
    const { data: report, error: fetchError } = await supabase
      .from(tableName)
      .select('timestamp')
      .eq('id', id)
      .single();

    if (fetchError || !report) {
      console.error('Error fetching report for deletion:', fetchError);
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Delete from database
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting report from database:', error);
      return NextResponse.json({ error: 'Failed to delete report from database' }, { status: 500 });
    }

    // Delete from Google Sheets
    const { deleteFromSheet } = await import('@/lib/googleSheets');
    const sheetResult = await deleteFromSheet(sheetName, report.timestamp);

    if (!sheetResult.success) {
      console.error('Error deleting from Google Sheets:', sheetResult.error);
      // Note: We don't return error here as database deletion succeeded
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in delete reports API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
