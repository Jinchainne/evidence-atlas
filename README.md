# EvidenceAtlas

> A wallet-driven GenLayer Project for durable, evidence-bound observation receipts.

[![Contract](https://img.shields.io/badge/GenLayer-StudioNet-4e9364)](https://explorer-studio.genlayer.com/address/0x28668FdEd42A0BC6Af6c0944dC14a2b2E2787982) [![App](https://img.shields.io/badge/Live-App-10251b)](https://evidence-atlas-bice.vercel.app) [![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## Project

EvidenceAtlas is a small GenLayer Project for creating durable, verifiable observation receipts. A user submits a question and HTTPS evidence URL, signs the transaction, waits for validator finality, and reads the canonical receipt back from the contract.

## At a glance

| Layer | Responsibility |
| --- | --- |
| Browser | Wallet connection, signed writes, receipt polling, canonical readback |
| Intelligent Contract | Request storage, independent evidence retrieval, typed consensus result |
| Validators | Re-fetch evidence and agree on answer, explanation and evidence digest |

```mermaid
flowchart LR
  U[User + EIP-1193 wallet] -->|sign| W[EvidenceAtlas contract]
  W -->|independent fetch| V[GenLayer validators]
  V -->|answer + SHA-256 digest| W
  W -->|finalized receipt| U
```

### User workflow

1. Connect a wallet to the configured GenLayer network.
2. Submit an observation question and source URL through the app.
3. The contract stores the request before any semantic decision.
4. `verify_observation` independently fetches the source and asks validators to classify it.
5. Consensus binds the answer to the exact evidence digest.
6. The UI reads `get_receipt` and shows the durable result; a transaction hash alone is never treated as success.

### Contract surface

- `submit_observation(receipt_id, question, evidence_url)`
- `verify_observation(receipt_id)`
- `get_receipt(receipt_id)`
- `list_receipt_ids()`

### Showcase

Add the deployed app, explorer contract, and repository links here after deployment. Keep the three links on the same release so reviewers can reproduce the workflow.

Production app: https://evidence-atlas-bice.vercel.app

Deployed contract: [`0x28668FdEd42A0BC6Af6c0944dC14a2b2E2787982`](https://explorer-studio.genlayer.com/address/0x28668FdEd42A0BC6Af6c0944dC14a2b2E2787982). Deployment transaction: [`0xefe85be91610b6765a010c60624879cb5549734856192a9b2cdb901a077ba8cd`](https://explorer-studio.genlayer.com/tx/0xefe85be91610b6765a010c60624879cb5549734856192a9b2cdb901a077ba8cd).

### Verification

```bash
python -m py_compile contracts/evidence_atlas.py
```

See [architecture](docs/ARCHITECTURE.md) and [threat model](docs/THREAT_MODEL.md) for the trust boundaries reviewers should verify.

EvidenceAtlas is an evidence-indexing demonstration, not professional advice.
