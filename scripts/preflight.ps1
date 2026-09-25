$ErrorActionPreference = "Stop"
python -m pytest -q
python -m py_compile contracts/evidence_atlas.py
$env:PYTHONUTF8 = "1"
$env:PYTHONIOENCODING = "utf-8"
genvm-lint check contracts/evidence_atlas.py
npm --prefix frontend run build
