# IREPORTER App

## Description
IREPORTER is a web application that allows users to report corruption and public issues.  
Users can create **red-flag** or **intervention records**, add geolocation, and track the status of their reports.  
Admins can update the status of these records, ensuring accountability and transparency.

---

## Features

### User Features
1. Users can create a **red-flag record** (an incident linked to corruption).  
2. Users can create **intervention records** (requests for government agencies to intervene, e.g., repair bad roads, collapsed bridges, flooding, etc.).  
3. Users can **edit** their red-flag or intervention records.  
4. Users can **delete** their red-flag or intervention records.  
5. Users can **add geolocation** (latitude and longitude coordinates) to their red-flag or intervention records.  
6. Users can **change the geolocation** attached to their red-flag or intervention records.  

### Admin Features
1. Admin can change the **status of a record** to:
   - `Under Investigation`
   - `Rejected` (for false claims)
   - `Resolved` (once the claim has been investigated and addressed)

### Optional Features
1. Users receive **real-time SMS notifications** when Admin changes the status of their record.

### Rules / Restrictions
1. A user can only **change the geolocation** of a record if its status is **not yet marked** as `Under Investigation`, `Rejected`, or `Resolved`.  
2. A user can only **edit or delete** a record if its status is **not yet marked** as `Under Investigation`, `Rejected`, or `Resolved`.  
3. **Only the user who created a record** can delete it.

---

## Project Structure

