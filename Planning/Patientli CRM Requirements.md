# **Healthcare Attribution CRM**

## **1\. Product Overview**

This product is a **healthcare-focused CRM and attribution platform** designed to help marketing agencies and healthcare practices clearly understand:

* **Which marketing channels generate real patients**

* **Which patients generate revenue**

* **How to reliably tie marketing spend to patient-level outcomes**

The system acts as a “HubSpot-like” dashboard for healthcare practices, with a strong emphasis on:

* Patient-level attribution

* Revenue reporting

* Secure integration with practice management software (starting with Open Dental)

The primary users are:

* Marketing agency admins

* Healthcare practice admins / office managers

---

## **2\. Core Problem Being Solved**

Today, attribution is handled manually:

* Patient data is pulled from practice management systems

* Names and phone numbers are manually cross-referenced against Google Ads, form fills, and call logs

* Revenue attribution is slow, error-prone, and not scalable

**This product replaces that manual process with an automated, secure, and auditable system** that produces:

* Monthly attribution reports

* Optional live dashboards

* Patient-level revenue attribution by channel

---

## **3\. Goals & Success Criteria**

### **Business Goals**

* Reduce monthly attribution reporting time from hours → minutes

* Increase trust in marketing performance reporting

* Enable agency upsells tied to measurable revenue impact

### **Product Success Metrics**

* % of patients successfully attributed to a channel

* Time to generate month-end attribution report

* Adoption by office staff (logins, dashboard views)

* Accuracy of revenue matching vs. manual checks

---

## **4\. User Roles & Permissions**

### **4.1 Admin User (Agency / Practice Admin)**

* Full access to dashboards and reports

* Can configure integrations (Open Dental, Google Ads, etc.)

* Can manage users and permissions

* Can view patient-level data (PHI)

### **4.2 Read-Only User (Optional, Phase 2\)**

* Can view reports and dashboards

* Cannot edit integrations or patient data

---

## **5\. MVP Feature Requirements (Phase 1\)**

### **5.1 Authentication & Security**

* Secure login (email \+ password minimum)

* Support for future SSO / MFA

* Role-based access control

* Full audit logging (who accessed what, when)

**Compliance requirement:** System must be architected to support HIPAA compliance (PHI handling, encryption at rest and in transit).  
---

### **5.2 Open Dental Integration (Required for MVP)**

**Purpose:** Pull patient and revenue data directly from the practice management system.

**Requirements:**

* Secure connection to Open Dental’s open API

* Scheduled or near-real-time data sync

* Ability to retrieve:

  * Patient identifiers (name, phone, email if available)

  * Appointment dates

  * Treatment and production values

  * Provider/location (if applicable)

**Notes:**

* Open Dental is the initial pilot integration

* Architecture should support future PMS integrations (Dentrix, Eaglesoft, etc.)

---

### **5.3 Marketing Data Ingestion**

**Channels for MVP:**

* Google Ads (including click-to-call)  
* Website form submissions (via webhook or API. Most client sites currently using Gravity Forms)  
* Google Business click to call  
* Website click to call 

The system should integrate with Google Analytics to attribute contacts back to their original source

**Data to ingest:**

* Lead timestamp

* Source / medium

* Campaign, ad group, ad (where available)

* Phone number and/or email

* Landing page or conversion point

---

### **5.4 Attribution Logic**

**Primary goal:** Match patients from Open Dental to marketing leads.

**Matching strategies (priority order):**

1. Phone number match

2. Email match

3. Name \+ date proximity (fallback)

4. Manual override (admin-assisted, if needed)

**Output:**

* One or more marketing touchpoints associated with each patient

* Primary source attribution (initial MVP can be last-click or first-touch; configurable later)

---

### **5.5 Dashboard: Lead & Revenue Overview**

**Main Dashboard View**

* Date range selector (this month, last month, custom)

* Total leads generated

* Total attributed patients

* Total attributed revenue

* Breakdown by channel:

  * Leads per channel

  * Patients per channel

  * Revenue per channel

---

### **5.6 Channel Drill-Down View**

When clicking into a channel (e.g., Google Ads):

**Display:**

* List of attributed patients

* For each patient:

  * Name

  * Date of first contact

  * Associated campaign / ad (if available)

  * Total production / revenue

  * Status (lead → patient)

This is the **core value view for practices**.

---

### **5.7 Reporting**

**MVP Reporting Features:**

* On-screen dashboards

* Exportable CSV or PDF summaries

* Month-end attribution snapshot

**Optional later:**

* Automated monthly email reports

---

## **6\. Data Model (High Level)**

**Core Objects:**

* User

* Practice

* Patient

* Lead

* Channel

* Attribution Record

* Revenue Event

**Key Relationships:**

* A Patient may have multiple Leads

* A Lead belongs to one Channel

* A Patient may generate multiple Revenue Events

* Attribution Record links Patient ↔ Lead ↔ Channel

---

## **7\. Non-Functional Requirements**

### **Security & Compliance**

* Encryption in transit (TLS)

* Encryption at rest

* Access logging

* PHI-safe data handling practices

* HIPAA-ready architecture (BAAs as needed)

### **Performance**

* Dashboard loads \< 3 seconds for typical practices

* Background sync jobs must not block UI

### **Scalability**

* Multi-practice support

* Multi-location practices

* Future multi-agency use

---

## **8\. Out of Scope for MVP (Phase 2 / Stretch Features)**

### **8.1 Outreach & Follow-Up Kanban Board (Nice-to-Have)**

**Concept:**

A Trello-style board for office staff to track outreach and follow-up with leads and new patients.

**Potential Features:**

* Columns such as:

  * New Lead

  * Contacted

  * Scheduled

  * Seen

  * Treatment Accepted

* Drag-and-drop patient cards

* Notes and activity logs per patient

* Manual status updates from office staff

**Why Phase 2:**

* Not required for core attribution

* Higher UX and workflow complexity

* Depends on adoption by office staff

---

### **8.2 Automated Outreach Integrations (Future)**

* Automated email sequences

* SMS follow-ups

* Agency-managed outreach services

---

## **9\. Open Questions for Engineering**

* Preferred attribution model for MVP (first-touch vs last-touch)?

* Real-time vs scheduled sync cadence for Open Dental?

* Where should manual attribution overrides live (UI vs admin tool)?

* Preferred hosting and HIPAA-ready infrastructure?

---

## **10\. Summary**

**MVP Focus:**

* Accurate, patient-level attribution

* Revenue transparency

* Simple, trustworthy reporting

**Future Vision:**

* A true healthcare CRM layer sitting between marketing systems and practice management software

* A foundation for agency-led growth services tied directly to revenue

