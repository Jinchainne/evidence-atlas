# Reviewer evidence packet

## Reproduce the release

1. Open the [live app](https://evidence-atlas-bice-two.vercel.app).
2. Connect an EIP-1193 wallet on StudioNet (chain `61999`).
3. Call `submit_observation` with a unique ID, a question of at least 20 characters, and an HTTPS source.
4. Wait for transaction finality, then call `verify_observation`.
5. Read `get_receipt` and verify `state=VERIFIED`, an allowed answer, explanation, and a 64-character evidence digest.
6. Attempt verification again; the state guard must reject the replay.

## Evidence links

- [Contract](https://explorer-studio.genlayer.com/address/0x35187fC98E72e2236B3E2874050Bb577C51F54b5)
- [Deployment transaction](https://explorer-studio.genlayer.com/tx/0x80b66de1865993d0bef0a67dc6af8c69059df8550e089f12af2cce6065994f6a)
- [Source provenance](../SOURCE_PROVENANCE.md)
