const targets: Record<string, string> = {
  Workspace: "#compose",
  Protocol: "#protocol",
  Activity: "#activity",
};

function bindNavigation() {
  document.querySelectorAll<HTMLElement>(".nav-links a").forEach((link) => {
    const label = link.textContent?.trim() ?? "";
    const target = targets[label];
    if (!target || link.dataset.bound === "true") return;
    const section = document.querySelector<HTMLElement>(target) ??
      (label === "Protocol" ? document.querySelector<HTMLElement>(".metrics") :
        label === "Activity" ? document.querySelector<HTMLElement>(".receipt") :
          document.querySelector<HTMLElement>("#compose"));
    if (section && !section.id) section.id = target.slice(1);
    link.dataset.bound = "true";
    link.setAttribute("href", target);
    link.setAttribute("role", "link");
    link.addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", target);
    });
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindNavigation);
else bindNavigation();
