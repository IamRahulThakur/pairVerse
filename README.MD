# PairVerse | Backend & System Design Showcase

**PairVerse** is a production-grade developer networking and skill-verification platform. It is engineered to solve the "hiring noise" problem by replacing traditional social engagement with **asynchronous, state-machine-driven technical workflows.**

This repository focuses on high-performance backend patterns, including **Service-Controller architecture**, **distributed caching**, and **event-driven background processing**.

---

## 🏗️ System Architecture
The system follows a **Service-Controller-Repository** pattern to ensure a clean separation of concerns and testability.

* **Runtime:** Node.js (Express.js)
* **Primary Store:** MongoDB + Mongoose (Flexible schema for evolving interview models)
* **Caching/Messaging:** Redis (Feed optimization & state-based caching)
* **Real-time:** Socket.io (Event-driven updates for chat and notifications)
* **Cloud Infrastructure:** Cloudinary (Binary large object storage for developer artifacts)

---

## 🚀 Engineering Highlights

### 1. High-Performance Caching Strategy
To handle heavy read traffic while maintaining data integrity, I implemented a multi-layered Redis strategy:
* **User Feed:** 120s TTL with event-based manual invalidation on post creation.
* **Peer Discovery:** 300s TTL for complex aggregation queries (tech-stack matching).
* **Results:** Reduced P95 latency for feed generation from **2s to <200ms**.

### 2. Reliable Background Processing
To keep the main request-response cycle non-blocking, non-critical tasks are offloaded to a background queue:
* **Notification Engine:** All system notifications are queued to ensure API responsiveness.
* **Media Cleanup:** Automatic removal of orphaned Cloudinary assets upon database deletion.

### 3. State-Machine Integrity
Instead of basic CRUD, connection requests and interview flows are managed via strict state transitions:
* `CREATED` → `STARTED` → `SUBMITTED` → `EVALUATING` → `SCORED`
* Validation logic in the `Service` layer prevents invalid transitions and data corruption.

---

## 🛡️ Security & Production Readiness
The system is hardened against common OWASP vulnerabilities:
* **Identity:** JWT-based authentication with `httpOnly` secure cookies.
* **Traffic Protection:** Rate limiting (100 reqs/15 min), Helmet.js headers, and HPP (Parameter Pollution) prevention.
* **Data Integrity:** Mongoose-level sanitization to block NoSQL injection and strict password hashing via Bcrypt (10 rounds).

---

## 📡 API Design (Core Modules)

### 🧩 Profile & Discovery
| Method | Endpoint | Logic |
| :--- | :--- | :--- |
| `GET` | `/api/matching-peers` | Tech-stack based matching via Redis-cached aggregation. |
| `GET` | `/api/feed` | Personalized time-series feed with intelligent cache invalidation. |

### 🤝 Networking & Verification
| Method | Endpoint | Logic |
| :--- | :--- | :--- |
| `POST` | `/api/request/:toUserId` | Bi-directional connection logic with async notification trigger. |
| `PUT` | `/api/request/:id/:status` | State update (Accept/Reject) with cache cleanup hooks. |

### 💬 Real-time Communication
* **WebSocket:** Persistent messaging via Socket.io with delivery confirmation and MongoDB persistence.

---

## 📁 Project Structure
```text
/config/      # Database, Redis, and Cloudinary initialization
/controllers/ # HTTP Request/Response handling logic
/middleware/  # Security, Auth, and Centralized Error Handling
/model/       # MongoDB Schemas with optimized indexing
/services/    # Core Business Logic (The "Brain" of the app)
/utils/       # Helper functions, Validators, and Socket setup