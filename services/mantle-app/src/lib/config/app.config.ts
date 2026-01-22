/**
 * Application configuration.
 *
 * To rename this app, update the `name` field below.
 * All other references use this config, so renaming is a single change.
 */
const app = {
  /** App name - change this to rename the product */
  name: "Mantle",
  /** App description with emoji */
  description: "🪨 Business operations, unified",
  /** App tagline */
  tagline: "Unified business operations suite",
  /** Production URL */
  url: "https://mantle.omni.dev",
  /** Organization info */
  organization: {
    name: "Omni",
    website: "https://omni.dev",
    discord: "https://discord.gg/omnidotdev",
    x: "https://x.com/omnidotdev",
    linkedin: "https://www.linkedin.com/company/omnidotdev",
  },
  /** External links */
  links: {
    docs: "https://docs.omni.dev/core/mantle",
    github: "https://github.com/omnidotdev/mantle",
    feedback: "https://backfeed.omni.dev/workspaces/omni/projects/mantle",
  },
  /** Module configuration - toggle modules on/off */
  modules: {
    people: { enabled: true, label: "People", icon: "👥" },
    invoices: { enabled: true, label: "Invoices", icon: "🧾" },
    quotes: { enabled: true, label: "Quotes & Contracts", icon: "📝" },
    inventory: { enabled: true, label: "Inventory", icon: "📦" },
  },
};

export default app;
