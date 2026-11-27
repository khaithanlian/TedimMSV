#!/usr/bin/env python3
"""Check available book JSON files against the website catalogue."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
catalog=json.loads((root/"data/books.json").read_text(encoding="utf-8"))
failed=False
for book in catalog["books"]:
    if not book["available"]: continue
    path=root/book["path"]
    if not path.exists():
        print(f"MISSING  {book['filename']}"); failed=True; continue
    try:
        data=json.loads(path.read_text(encoding="utf-8"))
        chapters=data["chapters"]
        verses=sum(len(ch["verses"]) for ch in chapters)
        print(f"OK       {book['filename']} ({len(chapters)} chapters, {verses} verses)")
    except Exception as exc:
        print(f"INVALID  {book['filename']}: {exc}"); failed=True
raise SystemExit(1 if failed else 0)
