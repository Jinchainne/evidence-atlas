import hashlib
import importlib.util
import json
import pathlib
import sys
import types
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]

class Decorator:
    def __call__(self, value): return value
class Map(dict):
    @classmethod
    def __class_getitem__(cls, item): return cls
class Array(list):
    @classmethod
    def __class_getitem__(cls, item): return cls

def load_contract():
    gl = types.SimpleNamespace(
        Contract=object, public=types.SimpleNamespace(write=Decorator(), view=Decorator()),
        nondet=types.SimpleNamespace(web=types.SimpleNamespace(render=lambda _url, mode="text": "Official evidence " * 20), exec_prompt=lambda *_a, **_k: {}),
        vm=types.SimpleNamespace(UserError=RuntimeError, Result=object, Return=type("Return", (), {}), run_nondet_unsafe=lambda leader, _validator: leader()),
        message=types.SimpleNamespace(sender_address="0x" + "1" * 40),
    )
    stub = types.ModuleType("genlayer"); stub.gl = gl; stub.TreeMap = Map; stub.DynArray = Array
    previous = sys.modules.get("genlayer"); sys.modules["genlayer"] = stub
    try:
        spec = importlib.util.spec_from_file_location("evidence_atlas_contract", ROOT / "contracts" / "evidence_atlas.py")
        module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module); return module
    finally:
        if previous is None: del sys.modules["genlayer"]
        else: sys.modules["genlayer"] = previous

class EvidenceAtlasTest(unittest.TestCase):
    def setUp(self):
        self.module = load_contract(); self.contract = object.__new__(self.module.EvidenceAtlas)
        self.contract.receipts = {}; self.contract.receipt_ids = []

    def submit(self, **overrides):
        values = {"receipt_id":"EVENT-001", "question":"Does this official source confirm the event?", "evidence_url":"https://example.org/evidence"}; values.update(overrides)
        self.contract.submit_observation(**values)

    def test_submit_freezes_request_and_normalizes_id(self):
        self.submit(); record = json.loads(self.contract.get_receipt("event-001"))
        self.assertEqual(record["id"], "EVENT-001"); self.assertEqual(record["state"], "SUBMITTED")

    def test_authorization_and_input_boundaries(self):
        for values in ({"receipt_id":"bad"}, {"question":"short"}, {"evidence_url":"http://example.org"}, {"evidence_url":"https://user@example.org"}):
            with self.assertRaises(RuntimeError): self.submit(**values)
        self.assertEqual(self.contract.receipts, {})

    def test_duplicate_and_double_verify_are_rejected(self):
        self.submit()
        with self.assertRaises(RuntimeError): self.submit()
        valid = {"answer":"OBSERVED", "explanation":"The source contains direct supporting evidence.", "evidence_digest": hashlib.sha256(("Official evidence " * 20).encode()).hexdigest()}
        self.module.gl.nondet.exec_prompt = lambda *_a, **_k: valid
        self.assertEqual(self.contract.verify_observation("EVENT-001"), "OBSERVED")
        with self.assertRaises(RuntimeError): self.contract.verify_observation("EVENT-001")

if __name__ == "__main__": unittest.main()
