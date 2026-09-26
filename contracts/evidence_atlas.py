# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
"""EvidenceAtlas: a Project workflow for durable evidence receipts."""
from genlayer import *
import hashlib
import json
import re
from urllib.parse import urlsplit

ANSWERS = ("OBSERVED", "NOT_OBSERVED", "INCONCLUSIVE")


class EvidenceAtlas(gl.Contract):
    receipts: TreeMap[str, str]
    receipt_ids: DynArray[str]

    def __init__(self):
        pass

    @gl.public.write
    def submit_observation(self, receipt_id: str, question: str, evidence_url: str) -> None:
        key = receipt_id.strip().upper()
        if re.fullmatch(r"[A-Z0-9][A-Z0-9_-]{3,39}", key) is None or key in self.receipts:
            raise gl.vm.UserError("Receipt ID is invalid or already exists")
        parsed = urlsplit(evidence_url.strip())
        if len(question.strip()) < 20 or len(question.strip()) > 1000 or parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password or parsed.fragment:
            raise gl.vm.UserError("Question or evidence URL is invalid")
        record = {"id": key, "question": question.strip(), "evidence_url": evidence_url.strip(), "submitter": str(gl.message.sender_address), "state": "SUBMITTED", "answer": "", "explanation": "", "evidence_digest": ""}
        self.receipts[key] = json.dumps(record, sort_keys=True, separators=(",", ":"))
        self.receipt_ids.append(key)

    @gl.public.write
    def verify_observation(self, receipt_id: str) -> str:
        key = receipt_id.strip().upper()
        record = json.loads(self.receipts.get(key, "")) if self.receipts.get(key, "") else None
        if not record or record["state"] != "SUBMITTED":
            raise gl.vm.UserError("Receipt is not available for verification")

        def assess():
            evidence = str(gl.nondet.web.render(record["evidence_url"], mode="text"))[:6000]
            digest = hashlib.sha256(evidence.encode()).hexdigest()
            result = gl.nondet.exec_prompt(f"Answer the question using only this evidence. Return JSON with answer (OBSERVED|NOT_OBSERVED|INCONCLUSIVE), explanation >=20 chars, evidence_digest exactly {digest}. Question: {record['question']} Evidence: {evidence}", response_format="json")
            if isinstance(result, str): result = json.loads(result)
            if set(result) != {"answer", "explanation", "evidence_digest"} or result["answer"] not in ANSWERS or len(str(result["explanation"]).strip()) < 20 or result["evidence_digest"] != digest:
                raise gl.vm.UserError("Receipt evidence integrity check failed")
            return result

        def agree(leader_result):
            return isinstance(leader_result, gl.vm.Return) and leader_result.calldata == assess()

        result = gl.vm.run_nondet_unsafe(assess, agree)
        record.update(state="VERIFIED", answer=result["answer"], explanation=result["explanation"], evidence_digest=result["evidence_digest"])
        self.receipts[key] = json.dumps(record, sort_keys=True, separators=(",", ":"))
        return result["answer"]

    @gl.public.view
    def get_receipt(self, receipt_id: str) -> str:
        return self.receipts.get(receipt_id.strip().upper(), "")

    @gl.public.view
    def list_receipt_ids(self) -> list[str]:
        return [item for item in self.receipt_ids]


    @gl.public.view
    def get_schema(self) -> dict:
        return {"answers": list(ANSWERS), "max_evidence_chars": 6000, "finalization": "one-time", "source_policy": "https-only"}
