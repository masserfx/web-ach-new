# 📋 Phase 4: Lead Management UI - Implementation Plan

## Priority Features

### 🎯 High Priority (Week 1)
1. **Lead Detail Page** (`/admin/leads/[id]`)
   - Full lead information display
   - Contact details, property info
   - GDPR consent tracking
   - Created/updated timestamps
   - Status badge

2. **Status Update Functionality**
   - Dropdown in lead list
   - Update via detail page
   - Status history tracking
   - Reason for lost/archived

### 🔍 Medium Priority (Week 2)
3. **Search & Filters**
   - Search by: email, phone, name
   - Filter by: status, property_type, urgency
   - Date range picker
   - Clear filters button

4. **Lead Export**
   - Export to CSV
   - Export to Excel (optional)
   - Custom column selection
   - Filtered export

### 📊 Low Priority (Future)
5. **Lead Assignment**
   - User management
   - Assign to sales rep
   - Filter by assigned user

6. **Notes & Comments**
   - Add notes to leads
   - Activity timeline
   - Email/call log

## Implementation Order

### Step 1: Lead Detail Page
**File**: `src/app/admin/leads/[id]/page.tsx`

**Features**:
- Dynamic route with lead ID
- Fetch lead from Supabase
- Display all lead information
- Status update form
- Back to list button

**Estimated Time**: 2-3 hours

### Step 2: Status Update
**Files**: 
- `src/app/admin/leads/page.tsx` (add dropdown)
- `src/app/api/leads/[id]/status/route.ts` (API endpoint)

**Features**:
- Dropdown component in list
- API endpoint for status update
- Optimistic UI update
- Success/error notifications

**Estimated Time**: 2 hours

### Step 3: Search & Filters
**Files**:
- `src/app/admin/leads/page.tsx` (add search/filter UI)
- `src/components/admin/LeadFilters.tsx` (new component)

**Features**:
- Search input (debounced)
- Status filter (multi-select)
- Property type filter
- Urgency filter
- Date range picker
- URL query params

**Estimated Time**: 3-4 hours

### Step 4: Export Functionality
**Files**:
- `src/app/api/leads/export/route.ts` (API endpoint)
- `src/components/admin/ExportButton.tsx` (new component)

**Features**:
- Generate CSV from leads
- Download trigger
- Include filtered leads only
- Custom column selection (optional)

**Estimated Time**: 2 hours

## Total Estimated Time: 9-11 hours

## Tech Stack

### Frontend
- Next.js 16 App Router
- React Server Components
- TypeScript
- Tailwind CSS
- Lucide Icons

### Backend
- Next.js API Routes
- Supabase PostgreSQL
- Server-side data fetching

### Libraries to Install
- `papaparse` (CSV generation) - optional
- `date-fns` (date handling) - optional

## Database Schema Updates

No schema changes needed! Current `leads` table has:
- All required fields
- Status tracking
- Timestamps
- GDPR consent

## Success Criteria

✅ Lead detail page displays all information
✅ Status can be updated from list and detail
✅ Search finds leads by email/phone/name
✅ Filters narrow down leads correctly
✅ Export generates valid CSV file
✅ All features work on mobile
✅ Performance: <1s page loads

## Next Steps

Ready to start with **Step 1: Lead Detail Page**?
