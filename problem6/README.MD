# Real-Time Leaderboard System – Improved Architecture

## Functional Requirements

- Display **Top 10 leaderboard** (API + realtime push).
- API to **increase score** when a user completes an action.
- **Anti-fraud measures**: JWT, rate limiting, idempotency.
- Record **event history**.

---

## Non-Functional Requirements

- End-to-end latency **≤ 300ms p95**.
- High throughput (**thousands of events/s**).
- **High Availability** and fault tolerance (Kafka replication).
- **Observability**: logs, metrics, tracing.

---

## System Architecture

```mermaid
flowchart LR
  C[Client App]
  G[API Gateway]
  AS[API Service]
  SP[Score Processor]
  WS[WebSocket Gateway]
  K[Keycloak]
  JC[Redis JWT Cache]
  R[Redis Leaderboard]
  M[MongoDB]
  KF[Kafka]

  %% HTTP path
  C --> G
  G --> JC
  G --> K
  G --> AS
  AS --> KF
  KF --> SP
  SP --> M
  SP --> R

  %% Realtime path
  C --> G
  G --> WS
  KF --> WS
  WS --> G
  G --> C
```

---

## Event Flow

```mermaid
sequenceDiagram
    autonumber
    participant C as Client App
    participant G as API Gateway
    participant JC as JWT Cache (Redis)
    participant K as Keycloak Auth
    participant AS as API Service
    participant SP as Score Processor
    participant WS as WebSocket Gateway
    participant KF as Kafka
    participant M as MongoDB
    participant R as Redis Leaderboard

    C->>G: 1. Submit Score (HTTP + JWT)
    G->>JC: 2. Check JWT cache
    alt Cache miss
        G->>K: 3. Validate JWT
        K-->>G: OK or Fail
        alt Valid
            G->>JC: 4. Cache token (short TTL)
        else Invalid
            G-->>C: 401 Unauthorized
        end
    end
    G->>AS: 5. Forward request + claims
    AS->>KF: 6. Publish score-events

    KF->>SP: 7. Consume score-events
    SP->>M: 8. Persist event (idempotent)
    SP->>R: 9. ZINCRBY leaderboard
    alt Top10 changed
        SP->>KF: 10. Publish top10-updates
    end

    C->>G: 11. WebSocket connect (JWT)
    G->>JC: 12. Check JWT cache
    alt Cache miss
        G->>K: 13. Validate JWT
        K-->>G: OK or Fail
        alt Valid
            G->>JC: 14. Cache token (short TTL)
        else Invalid
            G-->>C: 401 Unauthorized
        end
    end
    G->>WS: 15. Proxy WebSocket connection
    KF->>WS: 16. Consume top10-updates
    WS-->>G: 17. Push Top10 update
    G-->>C: 18. Deliver WS message
```

---

## Component Explanation

- **Client App**: Web/mobile client that submits scores and receives realtime leaderboard updates.
- **API Gateway**: Single entry point. Handles JWT validation (with Redis cache), rate limiting, routing, and WebSocket proxying.
- **JWT Cache (Redis)**: Stores token introspection results with short TTL to reduce Keycloak load.
- **Keycloak/Auth**: Issues and validates JWTs (OAuth2/OIDC). Gateway only calls it on cache miss.
- **API Service**: Stateless service that accepts validated requests, publishes `score-events` to Kafka.
- **Kafka**: Durable message broker. Decouples request submission from processing. Allows horizontal scaling with consumer groups.
- **Score Processor**: Consumes events from Kafka, writes to MongoDB, updates Redis sorted sets, and emits `top10-updates`.
- **MongoDB**: Persistent store for user scores and event history.
- **Redis Leaderboard**: Stores leaderboard in-memory for fast ZSET operations and queries.
- **WebSocket Gateway**: Subscribes to Kafka `top10-updates` and pushes updates back to clients via Gateway proxy.

---

## Scaling Strategy

- **Few thousand users**: Redis + RabbitMQ may suffice.
- **Hundreds of thousands of users**: Kafka becomes essential for throughput and durable event logs.
- **Horizontal scaling**:
  - API Gateway, API Service, Score Processor, and WS Gateway scale independently.
  - Kafka supports scaling via partitions & consumer groups.
  - Redis Cluster and MongoDB Sharding for larger data and higher throughput.

---

## Observability & High Availability

- **Logging & Metrics**: Use Prometheus/Grafana and centralized logging (ELK or Loki).
- **MongoDB**: Replica set.
- **Redis**: Cluster.
- **Kafka**: Replication factor ≥ 3 for fault tolerance.

---
