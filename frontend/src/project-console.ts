const panelMarkup = `
  <section class="protocol-surface" aria-label="EvidenceAtlas protocol control surface">
    <div class="surface-heading">
      <div><span class="eyebrow">GENLAYER CONTROL SURFACE</span><h2>Adjudication, made visible.</h2></div>
      <a href="https://explorer-studio.genlayer.com/address/0x35187fC98E72e2236B3E2874050Bb577C51F54b5" target="_blank" rel="noreferrer">Open explorer ↗</a>
    </div>
    <div class="surface-grid">
      <article class="surface-card consensus-card"><div class="card-kicker">01 · CONSENSUS PATH</div><h3>Independent agreement</h3><p>One source. Multiple validators. One canonical decision.</p><div class="consensus-steps"><span class="is-live"><i/>Leader fetch</span><b>→</b><span><i/>Validator review</span><b>→</b><span><i/>Finalized</span></div></article>
      <article class="surface-card"><div class="card-kicker">02 · INTELLIGENT CONTRACT</div><h3>Non-deterministic by design</h3><p>Live web content and LLM judgment stay inside a consensus boundary.</p><div class="tech-chips"><code>gl.nondet.web.render</code><code>gl.nondet.exec_prompt</code><code>SHA-256 evidence</code></div></article>
      <article class="surface-card lifecycle-card"><div class="card-kicker">03 · TRANSACTION LIFECYCLE</div><h3>Decision, not just a hash</h3><p>Track the operation until GenLayer reports a successful execution result.</p><div class="lifecycle-pills"><span>Signed</span><span>Submitted</span><span>Decided</span><span>Finalized</span></div></article>
    </div>
  </section>`;

function mountSurface() {
  const grid = document.querySelector<HTMLElement>(".workspace-grid");
  if (!grid || document.querySelector(".protocol-surface")) return;
  grid.insertAdjacentHTML("beforebegin", panelMarkup);
}

const start = () => {
  mountSurface();
  const observer = new MutationObserver(mountSurface);
  observer.observe(document.body, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 5000);
};

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
else start();
