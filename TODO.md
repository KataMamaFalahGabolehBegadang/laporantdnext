# TODO: Add File Upload to Kendala Forms

## Pending Tasks
- [x] Update Kendala interface in morning/step4/page.tsx to include buktiKendala field
- [x] Update Kendala interface in afternoon/step4/page.tsx to include buktiKendala field
- [x] Add file upload functionality to kendala forms in morning/step4/page.tsx
- [x] Add file upload functionality to kendala forms in afternoon/step4/page.tsx
- [x] Update PDF generation in morning/summary/page.tsx to include buktiKendala links in KENDALA table
- [x] Update PDF generation in afternoon/summary/page.tsx to include buktiKendala links in KENDALA table
- [ ] Test the new upload functionality for kendalas

## Information Gathered
- Kendala interface currently: { id, nama, waktu, buktiKendala }
- Upload functionality exists in step2 pages using Cloudinary API
- PDF generation uses jsPDF with autoTable for colorful bordered tables
- Form data stored in localStorage as 'morningFormData' and 'afternoonFormData'

## Plan
1. Modify Kendala interface to add buktiKendala: string
2. Add file input and upload handling to each kendala item in step4 forms
3. Update PDF tables to include buktiKendala column with clickable links
4. Ensure localStorage updates include the new field

## Dependent Files
- src/app/morning/step4/page.tsx
- src/app/afternoon/step4/page.tsx
- src/app/morning/summary/page.tsx
- src/app/afternoon/summary/page.tsx
