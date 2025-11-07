import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function submitMorningReport(formData: any) {
  try {
    const timestamp = new Date().toISOString();
    const tanggal = formData.customDate || new Date().toISOString().split('T')[0];
    const data = {
      timestamp,
      pdu_staff: formData.pduStaff || '',
      td_staff: formData.tdStaff || '',
      transmisi_staff: formData.transmisiStaff?.map((name: string) => name.replace(/^Transmisi\s+/, '')).join(', ') || '',
      bukti_studio: formData.buktiStudio || '',
      bukti_streaming: formData.buktiStreaming || '',
      bukti_subcontrol: formData.buktiSubcontrol || '',
      selected_events: formData.selectedEvents?.map((e: any) => `${e.time}: ${e.name} (${e.type})`).join('; ') || '',
      kendalas: formData.kendalas?.map((k: any) => `${k.nama} - ${k.waktu}`).join('; ') || '',
      tanggal,
    };

    const { error } = await supabase.from('morning_reports').insert([data]);

    if (error) {
      console.error('Error inserting morning report:', error);
      return { success: false, error };
    }

    // Also submit to Google Sheets
    const { submitMorningReport: submitToSheets } = await import('./googleSheets');
    await submitToSheets(formData);

    return { success: true };
  } catch (error) {
    console.error('Error submitting morning report:', error);
    return { success: false, error };
  }
}

export async function submitAfternoonReport(formData: any) {
  try {
    const timestamp = new Date().toISOString();
    const tanggal = formData.customDate || new Date().toISOString().split('T')[0];
    const data = {
      timestamp,
      pdu_staff: formData.pduStaff || '',
      td_staff: formData.tdStaff || '',
      transmisi_staff: formData.transmisiStaff?.map((name: string) => name.replace(/^Transmisi\s+/, '')).join(', ') || '',
      bukti_studio: formData.buktiStudio || '',
      bukti_streaming: formData.buktiStreaming || '',
      bukti_subcontrol: formData.buktiSubcontrol || '',
      selected_events: formData.selectedEvents?.map((e: any) => `${e.time}: ${e.name} (${e.type})`).join('; ') || '',
      kendalas: formData.kendalas?.map((k: any) => `${k.nama} - ${k.waktu}`).join('; ') || '',
      tanggal,
    };

    const { error } = await supabase.from('afternoon_reports').insert([data]);

    if (error) {
      console.error('Error inserting afternoon report:', error);
      return { success: false, error };
    }

    // Also submit to Google Sheets
    const { submitAfternoonReport: submitToSheets } = await import('./googleSheets');
    await submitToSheets(formData);

    return { success: true };
  } catch (error) {
    console.error('Error submitting afternoon report:', error);
    return { success: false, error };
  }
}
