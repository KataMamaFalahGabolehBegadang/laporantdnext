import { NextRequest, NextResponse } from 'next/server';
import { submitMorningReport } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    const result = await submitMorningReport(formData);

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Report submitted successfully' });
    } else {
      return NextResponse.json({ success: false, message: 'Failed to submit report' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error submitting morning report:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
