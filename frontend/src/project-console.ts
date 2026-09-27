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

const guideMarkup = `
  <section class="howto" aria-label="How to use EvidenceAtlas">
    <div class="howto-head"><div><span class="eyebrow">START HERE</span><h2>From public evidence to a finalized receipt.</h2></div><button type="button" data-load-example>Load sample claim <span>↗</span></button></div>
    <div class="howto-steps">
      <article><span>01</span><div><strong>Connect StudioNet</strong><p>Sign with your wallet on chain 61999. The app switches networks for you.</p></div></article>
      <article><span>02</span><div><strong>Submit an observation</strong><p>Pin a question and an HTTPS source. The contract stores it as <code>SUBMITTED</code>.</p></div></article>
      <article><span>03</span><div><strong>Run consensus</strong><p>Validators independently fetch the source, compare the digest and finalize the receipt.</p></div></article>
    </div>
    <div class="howto-note"><i></i><span>Nothing is simulated: success appears only after the canonical contract readback.</span><a href="https://explorer-studio.genlayer.com/address/0x35187fC98E72e2236B3E2874050Bb577C51F54b5" target="_blank" rel="noreferrer">Inspect contract ↗</a></div>
  </section>`;

function mountSurface() {
  const hero = document.querySelector<HTMLElement>(".hero");
  if (hero && !hero.querySelector(".fluxora-media")) {
    hero.insertAdjacentHTML("afterbegin", `<div class="fluxora-media" aria-hidden="true"><video autoplay muted loop playsinline preload="metadata" src="/hero-loop.mp4"></video><div class="fluxora-scrim"></div><div class="fluxora-rules"><i></i><i></i><i></i></div></div>`);
  }
  if (hero && !document.querySelector(".howto")) hero.insertAdjacentHTML("afterend", guideMarkup);
  const grid = document.querySelector<HTMLElement>(".workspace-grid");
  if (!grid || document.querySelector(".protocol-surface")) return;
  grid.insertAdjacentHTML("beforebegin", panelMarkup);
  const sample = document.querySelector<HTMLButtonElement>("[data-load-example]");
  sample?.addEventListener("click", () => {
    const values: Record<string, string> = {
      "input[placeholder=\"EVENT-001\"]": "EVENT-GENLAYER-01",
      "textarea[placeholder=\"What does the evidence establish?\"]": "Does the GenLayer documentation describe validator consensus for non-deterministic web evidence?",
      "input[placeholder=\"https://source.example/report\"]": "https://docs.genlayer.com/",
    };
    Object.entries(values).forEach(([selector, value]) => {
      const input = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector);
      if (!input) return;
      const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), "value")?.set;
      setter?.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
    document.querySelector("#compose")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

const start = () => {
  mountSurface();
  const observer = new MutationObserver(mountSurface);
  observer.observe(document.body, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 5000);
};

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
else start();
