# Fuse Partner Core

Private Twenty app package for shared Fuse partner taxonomy and operating primitives.

This app is intentionally platform-native: it extends standard Company, Person, and Opportunity objects, then adds shared partner profile, program, and enrollment objects. Partner-type specific apps, such as Agency Partner Program, should install on top of this foundation instead of running the old Partner OS bootstrap path.

## Included

- Canonical Fuse partner type, program mechanic, and commercial model fields.
- Standard object extensions for Company, Person, and Opportunity.
- Shared `partnerProfile`, `partnerProgram`, and `partnerEnrollment` custom objects.
- Relations connecting profiles to Companies, People, Opportunities, Programs, and Enrollments.
- Partner operator role, sidebar navigation, starter views, post-install seed hook, and `PartnerAppSpec` validation descriptor.
