# Threat model

- **Prompt injection:** fetched pages are untrusted evidence, never instructions.
- **Evidence drift:** validator equality includes the SHA-256 digest of the fetched source.
- **Replay:** receipt IDs are unique and verified receipts cannot be verified twice.
- **UI spoofing:** the app must display the contract readback, not optimistic local state.
- **Source abuse:** production deployments should add an allowlist and response-size limit per application domain.
