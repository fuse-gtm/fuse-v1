# Fuse Agency Partner Program

Private Twenty app package for the agency-specific partner operating layer.

This app installs on top of `fuse-partner-core`. It does not recreate the old Partner OS bootstrap path. Core supplies canonical partner profiles, partner taxonomy, and standard Company, Person, and Opportunity extensions; this package adds agency intake, services, attribution, resources, tasks, operator views, and an agency overview record-page widget.

## Included

- Agency application, service capability, resource, attribution, and task objects.
- Agency group and review event objects for approval cohorts and audit history.
- Signed agency referral event and rollup objects for lead/sale attribution.
- Reverse relation fields on core Partner Profile plus standard Company, Person, and Opportunity.
- Agency operator role, sidebar navigation, table views, page layout, front component, post-install seed hook, and `PartnerAppSpec` descriptor.
- Public application submission plus authenticated approval/rejection route logic functions.
- Signed lead/sale ingestion and authenticated rollup repair route logic functions.
- Application Review and Performance front components with route-backed operator actions.
- Agency Program Operator skill and agent prompt that preserve Fuse's 3-axis partner model.
- Agency taxonomy aligned to Fuse's Axis 1 `agency` type with referral/services mechanics.
