# Reviewer evidence packet

## Reproduce the release

1. Open the [live app](https://evidence-atlas-bice.vercel.app).
2. Connect an EIP-1193 wallet on StudioNet (chain `61999`).
3. Call `submit_observation` with a unique ID, a question of at least 20 characters, and an HTTPS source.
4. Wait for transaction finality, then call `verify_observation`.
5. Read `get_receipt` and verify `state=VERIFIED`, an allowed answer, explanation, and a 64-character evidence digest.
6. Attempt verification again; the state guard must reject the replay.

## Evidence links

- [Contract](https://explorer-studio.genlayer.com/address/0x28668FdEd42A0BC6Af6c0944dC14a2b2E2787982)
- [Deployment transaction](https://explorer-studio.genlayer.com/tx/0xefe85be91610b6765a010c60624879cb5549734856192a9b2cdb901a077ba8cd)
- [Source provenance](../SOURCE_PROVENANCE.md)
