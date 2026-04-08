# Fuse License and Distribution Baseline

**Issue:** FUSE-104
**Date:** 2026-03-01
**Owner:** Dhruv

## Plan Details

- **Plan:** Organization Self-Hosted
- **Workspace:** fusegtm.twenty.com
- **Billing cycle:** Monthly (next renewal: 2026-04-01)
- **Seats:** 1
- **Credits:** 5,000,000

## License Position

Twenty's billing documentation states that the Organization Self-Hosted plan includes:

> "All from Pro + the Premium features (SSO, row-level permissions), Twenty team support, not required to publish your custom code as open-source before distributing."

**Source:** https://docs.twenty.com/user-guide/billing/overview

This means:

1. Fuse's custom code (everything under `packages/twenty-server/src/modules/partner-os/`) is **not** subject to open-source publication requirements when distributing Fuse to customers.
2. Modifications to Twenty's codebase made by Fuse are covered under this license.
3. The original Twenty LICENSE file must remain in the repository (standard fork hygiene).

## Evidence

- **Plan activation:** Screenshot of `fusegtm.twenty.com/settings/billing` showing Organization plan active (stored as conversation evidence, 2026-03-01).
- **Written terms:** https://docs.twenty.com/user-guide/billing/overview — confirms no open-source publication obligation for Organization Self-Hosted customers.

## Phase 1 Legal Acceptance

For Phase 1, legal/commercial sufficiency is met by:

1. Public Twenty billing documentation stating Organization Self-Hosted distribution terms.
2. Screenshot evidence that Fuse is on the Organization Self-Hosted plan.

A separate support ticket response is operationally useful but **not** required for legal acceptance.

## Constraints and Obligations

1. **Do not delete the Twenty LICENSE file** without explicit written confirmation from Twenty.
2. **Do not redistribute Twenty's core code** as a standalone product. Fuse is a derivative product built on Twenty's platform.
3. **Maintain the fork relationship.** Twenty's upstream code remains theirs. Fuse's additions are Fuse's.
4. **Review on plan changes.** If the plan is downgraded or lapses, this license position must be re-evaluated immediately.

## Open Items

- (Optional) Request formal license agreement or terms-of-service document from Twenty for long-term legal records (beyond the billing page description).
- (Optional) Confirm whether Twenty requires attribution in customer-facing UI (not stated in billing docs).
