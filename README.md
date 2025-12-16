

## 🎯 Problem Statement

Most task apps fail to model **real payment workflows**.  
TaskMate fixes this by enforcing **strict role-based actions**:

- Work must be completed **before** payment is chosen
- Payment must be confirmed **by the receiver**
- Tasks close automatically once the lifecycle is complete

---

## 🔁 Task Lifecycle (Canonical Flow)

open
→ accepted
→ in_progress
→ work_done
→ payment_pending
→ payment_received
→ closed


---

## 👤 Role-Based Actions

| Step | Action | Who |
|---|---|---|
| Accept task | Accept | Acceptor |
| Start task | Start | Acceptor |
| Finish work | Mark work done | Acceptor |
| Choose payment | Select payment method | Creator |
| Complete task | Mark complete | Creator |
| Confirm payment | Payment received | Acceptor |
| Close task | Auto/system | System |

This mirrors **real hostel gig workflows**.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16 (App Router)**
- **React**
- **Tailwind CSS**

### Backend
- **Next.js API Routes (App Router)**
- **Firebase Admin SDK**
- **Firestore (NoSQL Database)**

### Authentication
- **NextAuth.js**
- **Google OAuth**

### Deployment
- **Vercel**
- **Google Cloud Console (OAuth & Service Account)**

---
