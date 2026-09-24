# EvidenceAtlas architecture

The browser only submits a question and an HTTPS source. `submit_observation` freezes that request on-chain. `verify_observation` is the trust boundary: every validator fetches the same source independently, hashes the exact fetched bytes, and returns a typed observation. `run_nondet_unsafe` accepts the receipt only when answer, explanation, and digest agree. `get_receipt` is the canonical read used by the UI.

## Failure policy

Unavailable or malformed evidence must produce `INCONCLUSIVE` or a reverted transaction; it must never be rendered as a positive observation. A transaction hash is pending until receipt finality and a canonical readback.
