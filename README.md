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
7.  Once the status of the report has been changed the admin then the  user can nolonger edit  anything . 

### Admin Features
1. Admin can change the **status of a record** to:
   - `Under Investigation`
   - `Rejected` (for false claims)
   - `Resolved` (once the claim has been investigated and addressed)
   And also the Admin can change the status of the Admin only when  the status is  still in draft form

### Optional Features
1. Users receive **real-time SMS notifications** when Admin changes the status of their record.
2. It has been implemnted that a  user gets a real email notification when the status of the report has been changed .
3. The local email notification also with in the system also works .

### Rules / Restrictions
1. A user can only **change the geolocation** of a record if its status is **not yet marked** as `Under Investigation`, `Rejected`, or `Resolved`.  
2. A user can only **edit or delete** a record if its status is **not yet marked** as `Under Investigation`, `Rejected`, or `Resolved`.  
3. **Only the user who created a record** can delete it.

There are three kinds of states of Reports :
 1.  Drafted
 2. Resolved.
 3. Under-investigation.

---

## Project Structure
 Frontend used React of TypeScript also for backend you must also type npm run dev.
 Backend used mysql  starting it you need to  type npm run dev



