#!/usr/bin/env python3
"""
Partner-OS schema definitions organized by motion module.

Three modules:
  - CORE: partner entity model (shared by all motions)
  - COSELL: pipeline mapping + attribution + reporting
  - DISCOVERY: AI-powered partner finding via Exa websets

Each customer workspace gets CORE + whichever motion modules they use.
The schema is opinionated (pre-defined objects/fields per module) but
customers can add custom fields after bootstrap.
"""


def _select_options(*values: str) -> list[dict]:
    semantic_colors = {
        "positive": "green",
        "warning": "yellow",
        "negative": "red",
        "neutral": "sky",
    }

    def _pick_color(value: str) -> str:
        normalized = value.upper()

        if any(
            token in normalized
            for token in (
                "ACTIVE",
                "WON",
                "MATCHED",
                "CERTIFIED",
                "SUCCESS",
                "CONVERTED",
                "CLOSED_WON",
            )
        ):
            return semantic_colors["positive"]

        if any(
            token in normalized
            for token in (
                "BLOCKED",
                "FAILED",
                "ERROR",
                "LOST",
                "EXPIRED",
                "TERMINATED",
                "DISQUALIFIED",
                "CLOSED_LOST",
            )
        ):
            return semantic_colors["negative"]

        if any(
            token in normalized
            for token in (
                "PENDING",
                "PAUSED",
                "EVALUATING",
                "NEW",
                "QUALIFYING",
                "PROSPECT",
                "IDENTIFIED",
            )
        ):
            return semantic_colors["warning"]

        return semantic_colors["neutral"]

    return [
        {
            "value": v,
            "label": v.lower().replace("_", " ").title(),
            "color": _pick_color(v),
            "position": i,
        }
        for i, v in enumerate(values)
    ]


# ---------------------------------------------------------------------------
# Schema types
# ---------------------------------------------------------------------------

class FieldDef:
    def __init__(self, field_type: str, name: str, label: str, icon: str,
                 options: list | None = None, default_value=None):
        self.type = field_type
        self.name = name
        self.label = label
        self.icon = icon
        self.options = options
        self.default_value = default_value

    def to_mcp_args(self, object_metadata_id: str) -> dict:
        args: dict = {
            "objectMetadataId": object_metadata_id,
            "type": self.type,
            "name": self.name,
            "label": self.label,
            "icon": self.icon,
        }
        if self.options is not None:
            args["options"] = self.options
        if self.default_value is not None:
            args["defaultValue"] = self.default_value
        return args


class RelationDef:
    def __init__(self, name: str, label: str, icon: str,
                 target_object_name: str, relation_type: str,
                 target_field_label: str, target_field_icon: str):
        self.name = name
        self.label = label
        self.icon = icon
        self.target_object_name = target_object_name
        self.relation_type = relation_type  # "MANY_TO_ONE" or "ONE_TO_MANY"
        self.target_field_label = target_field_label
        self.target_field_icon = target_field_icon

    def to_mcp_args(self, source_object_id: str, target_object_id: str) -> dict:
        return {
            "objectMetadataId": source_object_id,
            "type": "RELATION",
            "name": self.name,
            "label": self.label,
            "icon": self.icon,
            "relationCreationPayload": {
                "type": self.relation_type,
                "targetObjectMetadataId": target_object_id,
                "sourceFieldLabel": self.label,
                "targetFieldLabel": self.target_field_label,
                "targetFieldIcon": self.target_field_icon,
            },
        }


class ViewDef:
    def __init__(self, name: str, view_type: str = "TABLE",
                 kanban_field: str | None = None,
                 calendar_field: str | None = None):
        self.name = name
        self.type = view_type
        self.kanban_field = kanban_field
        self.calendar_field = calendar_field


class ObjectDef:
    def __init__(self, name_singular: str, name_plural: str,
                 label_singular: str, label_plural: str,
                 description: str, icon: str,
                 fields: list[FieldDef] | None = None,
                 relations: list[RelationDef] | None = None,
                 views: list[ViewDef] | None = None):
        self.name_singular = name_singular
        self.name_plural = name_plural
        self.label_singular = label_singular
        self.label_plural = label_plural
        self.description = description
        self.icon = icon
        self.fields = fields or []
        self.relations = relations or []
        self.views = views or [ViewDef(f"All {label_plural}")]

    def to_mcp_args(self) -> dict:
        return {
            "nameSingular": self.name_singular,
            "namePlural": self.name_plural,
            "labelSingular": self.label_singular,
            "labelPlural": self.label_plural,
            "description": self.description,
            "icon": self.icon,
            "isRemote": False,
        }


class MotionModule:
    def __init__(self, name: str, description: str, objects: list[ObjectDef]):
        self.name = name
        self.description = description
        self.objects = objects


# ---------------------------------------------------------------------------
# MODULE: CORE — partner entity model
# ---------------------------------------------------------------------------

CORE_MODULE = MotionModule(
    name="core",
    description="Partner entity model — profiles, contacts, and leads",
    objects=[
        ObjectDef(
            "partnerProfile", "partnerProfiles",
            "Partner Profile", "Partner Profiles",
            "Partner role profile layered on top of a canonical company",
            "IconBuildingHandshake",
            fields=[
                FieldDef("SELECT", "partnerType", "Partner Type", "IconHierarchy3",
                         _select_options("INTEGRATION_TECH", "AGENCY_SI", "AFFILIATE",
                                         "B2B_INFLUENCER_CREATOR", "RESELLER_VAR",
                                         "REFERRAL", "MARKETPLACE_COSELL")),
                FieldDef("SELECT", "lifecycleStage", "Lifecycle Stage", "IconProgressCheck",
                         _select_options("PROSPECT", "EVALUATING", "ACTIVE", "PAUSED", "TERMINATED")),
                FieldDef("SELECT", "status", "Status", "IconToggleLeft",
                         _select_options("ACTIVE", "INACTIVE", "BLOCKED")),
            ],
            relations=[
                RelationDef("company", "Company", "IconBuildingSkyscraper",
                            "company", "MANY_TO_ONE", "Partner Profiles", "IconBuildingHandshake"),
                RelationDef("owner", "Owner", "IconUserCircle",
                            "workspaceMember", "MANY_TO_ONE", "Owned Partner Profiles", "IconBuildingHandshake"),
            ],
            views=[
                ViewDef("All Partner Profiles"),
                ViewDef("By Lifecycle Stage", "KANBAN"),
            ],
        ),
        ObjectDef(
            "partnerContactAssignment", "partnerContactAssignments",
            "Partner Contact Assignment", "Partner Contact Assignments",
            "Contextual role of a person in a partner profile",
            "IconUserBolt",
            fields=[
                FieldDef("TEXT", "partnerRole", "Role", "IconId"),
                FieldDef("BOOLEAN", "isPrimary", "Is Primary", "IconStar", default_value=False),
                FieldDef("SELECT", "certificationStatus", "Certification Status", "IconCertificate",
                         _select_options("NOT_REQUIRED", "PENDING", "CERTIFIED", "EXPIRED")),
                FieldDef("TEXT", "notes", "Notes", "IconNotes"),
            ],
            relations=[
                RelationDef("partnerProfile", "Partner Profile", "IconBuildingHandshake",
                            "partnerProfile", "MANY_TO_ONE", "Contact Assignments", "IconUsers"),
                RelationDef("person", "Person", "IconUser",
                            "person", "MANY_TO_ONE", "Partner Assignments", "IconUsers"),
            ],
        ),
        ObjectDef(
            "lead", "leads",
            "Lead", "Leads",
            "Pre-conversion contact identity with partner lineage",
            "IconUserPlus",
            fields=[
                FieldDef("SELECT", "sourceType", "Source Type", "IconTargetArrow",
                         _select_options("MANUAL", "PARTNER_SOURCED", "INBOUND", "IMPORT")),
                FieldDef("SELECT", "status", "Status", "IconProgressCheck",
                         _select_options("NEW", "QUALIFYING", "CONVERTED", "DISQUALIFIED")),
                FieldDef("TEXT", "sourceDetail", "Source Detail", "IconTextCaption"),
                FieldDef("RICH_TEXT_V2", "notes", "Notes", "IconNotes"),
            ],
            relations=[
                RelationDef("sourcePartnerProfile", "Source Partner Profile", "IconBuildingSkyscraper",
                            "partnerProfile", "MANY_TO_ONE", "Sourced Leads", "IconUsers"),
                RelationDef("sourcePartnerPerson", "Source Partner Person", "IconUser",
                            "person", "MANY_TO_ONE", "Partner Sourced Leads", "IconUsers"),
                RelationDef("convertedPerson", "Converted Person", "IconUser",
                            "person", "MANY_TO_ONE", "Converted Leads", "IconUsers"),
                RelationDef("convertedCompany", "Converted Company", "IconBuildingSkyscraper",
                            "company", "MANY_TO_ONE", "Converted Leads", "IconUsers"),
                RelationDef("convertedOpportunity", "Converted Opportunity", "IconTargetArrow",
                            "opportunity", "MANY_TO_ONE", "Converted Leads", "IconUsers"),
            ],
            views=[
                ViewDef("All Leads"),
                ViewDef("By Status", "KANBAN"),
            ],
        ),
    ],
)


# ---------------------------------------------------------------------------
# MODULE: COSELL — pipeline mapping + attribution + reporting
# ---------------------------------------------------------------------------

COSELL_MODULE = MotionModule(
    name="cosell",
    description="Co-sell pipeline mapping, attribution events, and reporting snapshots",
    objects=[
        ObjectDef(
            "partnerCustomerMap", "partnerCustomerMaps",
            "Partner Customer Map", "Partner Customer Maps",
            "Mapping layer between partners and customer opportunities",
            "IconRouteAltLeft",
            fields=[
                FieldDef("SELECT", "mapStage", "Map Stage", "IconProgressCheck",
                         _select_options("IDENTIFIED", "MATCHED", "INTRODUCED",
                                         "CO_SELL", "CLOSED_WON", "CLOSED_LOST")),
                FieldDef("SELECT", "motionType", "Motion Type", "IconGitBranch",
                         _select_options("DISCOVERY", "REFERRAL", "CO_SELL",
                                         "INTEGRATION", "MARKETPLACE")),
                FieldDef("NUMBER", "confidence", "Confidence", "IconPercentage"),
            ],
            relations=[
                RelationDef("partnerProfile", "Partner Profile", "IconBuildingHandshake",
                            "partnerProfile", "MANY_TO_ONE", "Customer Maps", "IconRouteAltLeft"),
                RelationDef("customerCompany", "Customer Company", "IconBuildingSkyscraper",
                            "company", "MANY_TO_ONE", "Partner Customer Maps", "IconRouteAltLeft"),
                RelationDef("opportunity", "Opportunity", "IconTargetArrow",
                            "opportunity", "MANY_TO_ONE", "Partner Customer Maps", "IconRouteAltLeft"),
                RelationDef("owner", "Owner", "IconUserCircle",
                            "workspaceMember", "MANY_TO_ONE", "Owned Partner Customer Maps", "IconRouteAltLeft"),
            ],
            views=[
                ViewDef("All Partner Customer Maps"),
                ViewDef("By Map Stage", "KANBAN"),
            ],
        ),
        ObjectDef(
            "partnerAttributionEvent", "partnerAttributionEvents",
            "Partner Attribution Event", "Partner Attribution Events",
            "Immutable attribution touchpoint event",
            "IconClockHour4",
            fields=[
                FieldDef("SELECT", "eventType", "Event Type", "IconTargetArrow",
                         _select_options("SOURCED", "INFLUENCED", "INTRODUCED",
                                         "ASSISTED", "TOUCHPOINT")),
                FieldDef("DATE_TIME", "occurredAt", "Occurred At", "IconCalendarTime"),
                FieldDef("TEXT", "sourceObjectType", "Source Object Type", "IconDatabase"),
                FieldDef("TEXT", "sourceObjectId", "Source Object ID", "IconHash"),
                FieldDef("NUMBER", "weightHint", "Weight Hint", "IconPercentage"),
                FieldDef("RAW_JSON", "evidence", "Evidence", "IconFileDescription"),
            ],
            relations=[
                RelationDef("partnerProfile", "Partner Profile", "IconBuildingHandshake",
                            "partnerProfile", "MANY_TO_ONE", "Attribution Events", "IconClockHour4"),
                RelationDef("customerCompany", "Customer Company", "IconBuildingSkyscraper",
                            "company", "MANY_TO_ONE", "Partner Attribution Events", "IconClockHour4"),
                RelationDef("opportunity", "Opportunity", "IconTargetArrow",
                            "opportunity", "MANY_TO_ONE", "Partner Attribution Events", "IconClockHour4"),
            ],
            views=[ViewDef("All Attribution Events")],
        ),
        ObjectDef(
            "partnerAttributionSnapshot", "partnerAttributionSnapshots",
            "Partner Attribution Snapshot", "Partner Attribution Snapshots",
            "Materialized attribution snapshot for reporting",
            "IconChartHistogram",
            fields=[
                FieldDef("SELECT", "model", "Model", "IconHierarchy2",
                         _select_options("FIRST_TOUCH", "LAST_TOUCH", "LINEAR", "CUSTOM_WEIGHTED")),
                FieldDef("NUMBER", "lookbackWindowDays", "Lookback Window Days", "IconCalendarStats"),
                FieldDef("DATE", "periodStart", "Period Start", "IconCalendarEvent"),
                FieldDef("DATE", "periodEnd", "Period End", "IconCalendarEvent"),
                FieldDef("NUMBER", "creditedRevenue", "Credited Revenue", "IconCoins"),
                FieldDef("NUMBER", "creditPercent", "Credit Percent", "IconPercentage"),
            ],
            relations=[
                RelationDef("partnerProfile", "Partner Profile", "IconBuildingHandshake",
                            "partnerProfile", "MANY_TO_ONE", "Attribution Snapshots", "IconChartHistogram"),
                RelationDef("customerCompany", "Customer Company", "IconBuildingSkyscraper",
                            "company", "MANY_TO_ONE", "Partner Attribution Snapshots", "IconChartHistogram"),
                RelationDef("opportunity", "Opportunity", "IconTargetArrow",
                            "opportunity", "MANY_TO_ONE", "Partner Attribution Snapshots", "IconChartHistogram"),
            ],
        ),
        ObjectDef(
            "customerEvent", "customerEvents",
            "Customer Event", "Customer Events",
            "Append-only customer revenue and pipeline event ledger",
            "IconClockHour4",
            fields=[
                FieldDef("SELECT", "eventType", "Event Type", "IconBolt",
                         _select_options("OPPORTUNITY_CREATED", "OPPORTUNITY_STAGE_CHANGED",
                                         "OPPORTUNITY_CLOSED_WON", "OPPORTUNITY_CLOSED_LOST",
                                         "PARTNER_MENTIONED", "PARTNER_INTRODUCED", "PARTNER_ASSISTED")),
                FieldDef("DATE_TIME", "occurredAt", "Occurred At", "IconCalendarTime"),
                FieldDef("NUMBER", "eventValue", "Event Value", "IconCoins"),
                FieldDef("TEXT", "currencyCode", "Currency Code", "IconTextCaption"),
                FieldDef("TEXT", "sourceObjectType", "Source Object Type", "IconDatabase"),
                FieldDef("TEXT", "sourceObjectId", "Source Object ID", "IconHash"),
                FieldDef("RAW_JSON", "details", "Details", "IconFileDescription"),
            ],
            relations=[
                RelationDef("customerCompany", "Customer Company", "IconBuildingSkyscraper",
                            "company", "MANY_TO_ONE", "Customer Events", "IconClockHour4"),
                RelationDef("opportunity", "Opportunity", "IconTargetArrow",
                            "opportunity", "MANY_TO_ONE", "Customer Events", "IconClockHour4"),
                RelationDef("partnerProfile", "Partner Profile", "IconBuildingHandshake",
                            "partnerProfile", "MANY_TO_ONE", "Customer Events", "IconClockHour4"),
                RelationDef("partnerCustomerMap", "Partner Customer Map", "IconRouteAltLeft",
                            "partnerCustomerMap", "MANY_TO_ONE", "Customer Events", "IconClockHour4"),
            ],
        ),
        ObjectDef(
            "customerSnapshot", "customerSnapshots",
            "Customer Snapshot", "Customer Snapshots",
            "Materialized customer pipeline and revenue rollup",
            "IconChartHistogram",
            fields=[
                FieldDef("SELECT", "model", "Model", "IconHierarchy2",
                         _select_options("FIRST_TOUCH", "LAST_TOUCH", "LINEAR", "CUSTOM_WEIGHTED")),
                FieldDef("DATE", "periodStart", "Period Start", "IconCalendarEvent"),
                FieldDef("DATE", "periodEnd", "Period End", "IconCalendarEvent"),
                FieldDef("NUMBER", "openPipelineAmount", "Open Pipeline Amount", "IconChartArrows"),
                FieldDef("NUMBER", "sourcedRevenueAmount", "Sourced Revenue Amount", "IconCoins"),
                FieldDef("NUMBER", "influencedRevenueAmount", "Influenced Revenue Amount", "IconCoins"),
                FieldDef("NUMBER", "wonRevenueAmount", "Won Revenue Amount", "IconCoins"),
                FieldDef("NUMBER", "activeOpportunityCount", "Active Opportunity Count", "IconListNumbers"),
                FieldDef("NUMBER", "wonOpportunityCount", "Won Opportunity Count", "IconListNumbers"),
                FieldDef("DATE_TIME", "generatedAt", "Generated At", "IconCalendarTime"),
            ],
            relations=[
                RelationDef("customerCompany", "Customer Company", "IconBuildingSkyscraper",
                            "company", "MANY_TO_ONE", "Customer Snapshots", "IconChartHistogram"),
                RelationDef("partnerProfile", "Partner Profile", "IconBuildingHandshake",
                            "partnerProfile", "MANY_TO_ONE", "Customer Snapshots", "IconChartHistogram"),
                RelationDef("partnerCustomerMap", "Partner Customer Map", "IconRouteAltLeft",
                            "partnerCustomerMap", "MANY_TO_ONE", "Customer Snapshots", "IconChartHistogram"),
            ],
        ),
    ],
)


# ---------------------------------------------------------------------------
# MODULE: DISCOVERY — AI-powered partner finding
# ---------------------------------------------------------------------------

DISCOVERY_MODULE = MotionModule(
    name="discovery",
    description="Partner track execution, Exa webset discovery, scoring, and enrichment",
    objects=[
        ObjectDef(
            "partnerTrack", "partnerTracks",
            "Partner Track", "Partner Tracks",
            "Reusable discovery and partner execution template — one track per PartnerType x Outcome",
            "IconRoute",
            fields=[
                FieldDef("SELECT", "partnerType", "Partner Type", "IconHierarchy3",
                         _select_options("INTEGRATION_TECH", "AGENCY_SI", "AFFILIATE",
                                         "B2B_INFLUENCER_CREATOR", "RESELLER_VAR",
                                         "REFERRAL", "MARKETPLACE_COSELL")),
                FieldDef("SELECT", "entityType", "Entity Type", "IconUsersGroup",
                         _select_options("COMPANY", "PERSON")),
                FieldDef("SELECT", "outcome", "Outcome", "IconTargetArrow",
                         _select_options("GROW_REVENUE", "GROW_USAGE", "ENTER_MARKET",
                                         "REDUCE_CHURN", "EXPAND_SERVICES", "BRAND_AWARENESS")),
                FieldDef("BOOLEAN", "isTemplate", "Is Template", "IconTemplate", default_value=False),
                FieldDef("TEXT", "outreachAngle", "Outreach Angle", "IconMessage"),
                FieldDef("RAW_JSON", "successMetrics", "Success Metrics", "IconTargetArrow"),
            ],
            relations=[
                RelationDef("owner", "Owner", "IconUserCircle",
                            "workspaceMember", "MANY_TO_ONE", "Owned Partner Tracks", "IconRoute"),
            ],
        ),
        ObjectDef(
            "trackCheck", "trackChecks",
            "Track Check", "Track Checks",
            "Retrieval check and fit signal definition for a track",
            "IconChecklist",
            fields=[
                FieldDef("TEXT", "checkLabel", "Check Label", "IconTextCaption"),
                FieldDef("TEXT", "prompt", "Prompt", "IconFileDescription"),
                FieldDef("NUMBER", "weight", "Weight", "IconPercentage"),
                FieldDef("SELECT", "gateMode", "Gate Mode", "IconFilter",
                         _select_options("SIGNAL", "MUST_PASS")),
                FieldDef("NUMBER", "position", "Position", "IconSortAscending"),
            ],
            relations=[
                RelationDef("partnerTrack", "Partner Track", "IconRoute",
                            "partnerTrack", "MANY_TO_ONE", "Checks", "IconChecklist"),
            ],
        ),
        ObjectDef(
            "trackEnrichment", "trackEnrichments",
            "Track Enrichment", "Track Enrichments",
            "Enrichment column definition for a track",
            "IconTablePlus",
            fields=[
                FieldDef("TEXT", "enrichmentName", "Enrichment Name", "IconTextCaption"),
                FieldDef("TEXT", "prompt", "Prompt", "IconFileDescription"),
                FieldDef("SELECT", "format", "Format", "IconBrackets",
                         _select_options("TEXT", "NUMBER", "URL", "EMAIL", "PHONE", "OPTIONS")),
                FieldDef("NUMBER", "position", "Position", "IconSortAscending"),
            ],
            relations=[
                RelationDef("partnerTrack", "Partner Track", "IconRoute",
                            "partnerTrack", "MANY_TO_ONE", "Enrichments", "IconTablePlus"),
            ],
        ),
        ObjectDef(
            "trackExclusion", "trackExclusions",
            "Track Exclusion", "Track Exclusions",
            "Exclusion rule scoped to a partner track",
            "IconFilterX",
            fields=[
                FieldDef("TEXT", "identifier", "Identifier", "IconHash"),
                FieldDef("SELECT", "exclusionType", "Exclusion Type", "IconShieldX",
                         _select_options("COMPETITOR", "DNC", "ACTIVE_PARTNER",
                                         "ALREADY_CONTACTED", "BAD_FIT",
                                         "ALREADY_DISPLAYED", "RESTRICTED")),
                FieldDef("TEXT", "reason", "Reason", "IconNotes"),
            ],
            relations=[
                RelationDef("partnerTrack", "Partner Track", "IconRoute",
                            "partnerTrack", "MANY_TO_ONE", "Exclusions", "IconFilterX"),
            ],
        ),
        ObjectDef(
            "discoveryRun", "discoveryRuns",
            "Discovery Run", "Discovery Runs",
            "Single webset-backed execution of a partner track",
            "IconPlayerPlay",
            fields=[
                FieldDef("TEXT", "queryRaw", "Query Raw", "IconMessageSearch"),
                FieldDef("TEXT", "queryOptimized", "Query Optimized", "IconSparkles"),
                FieldDef("TEXT", "exaWebsetId", "Exa Webset ID", "IconHash"),
                FieldDef("SELECT", "status", "Status", "IconLoader",
                         _select_options("PENDING", "STREAMING", "COMPLETE", "CANCELLED", "ERROR")),
                FieldDef("RAW_JSON", "progress", "Progress", "IconChartArrows"),
                FieldDef("NUMBER", "resultCount", "Result Count", "IconListNumbers"),
                FieldDef("DATE_TIME", "startedAt", "Started At", "IconPlayerPlay"),
                FieldDef("DATE_TIME", "completedAt", "Completed At", "IconCheck"),
            ],
            relations=[
                RelationDef("partnerTrack", "Partner Track", "IconRoute",
                            "partnerTrack", "MANY_TO_ONE", "Discovery Runs", "IconPlayerPlay"),
                RelationDef("createdByMember", "Created By", "IconUserCircle",
                            "workspaceMember", "MANY_TO_ONE", "Discovery Runs", "IconPlayerPlay"),
            ],
        ),
        ObjectDef(
            "partnerCandidate", "partnerCandidates",
            "Partner Candidate", "Partner Candidates",
            "Candidate result returned by discovery run",
            "IconBuildingFactory2",
            fields=[
                FieldDef("TEXT", "entityUrl", "Entity URL", "IconLink"),
                FieldDef("SELECT", "entityType", "Entity Type", "IconUsersGroup",
                         _select_options("COMPANY", "PERSON")),
                FieldDef("TEXT", "displayName", "Display Name", "IconTextCaption"),
                FieldDef("TEXT", "companyDomain", "Company Domain", "IconWorld"),
                FieldDef("NUMBER", "fitScore", "Fit Score", "IconPercentage"),
                FieldDef("NUMBER", "confidence", "Confidence", "IconShieldCheck"),
                FieldDef("SELECT", "gateStatus", "Gate Status", "IconFilter",
                         _select_options("QUALIFIED", "DISQUALIFIED", "EXCLUDED")),
                FieldDef("TEXT", "gateReason", "Gate Reason", "IconAlertCircle"),
                FieldDef("DATE_TIME", "receivedAt", "Received At", "IconCalendarTime"),
            ],
            relations=[
                RelationDef("discoveryRun", "Discovery Run", "IconPlayerPlay",
                            "discoveryRun", "MANY_TO_ONE", "Candidates", "IconBuildingFactory2"),
            ],
        ),
        ObjectDef(
            "checkEvaluation", "checkEvaluations",
            "Check Evaluation", "Check Evaluations",
            "Per-check evaluation result for a candidate",
            "IconChecklist",
            fields=[
                FieldDef("SELECT", "status", "Status", "IconCircleCheck",
                         _select_options("MATCH", "NO_MATCH", "UNCLEAR")),
                FieldDef("TEXT", "reasoningMd", "Reasoning Markdown", "IconFileDescription"),
                FieldDef("RAW_JSON", "sources", "Sources", "IconLink"),
                FieldDef("NUMBER", "contribution", "Contribution", "IconPercentage"),
            ],
            relations=[
                RelationDef("partnerCandidate", "Partner Candidate", "IconBuildingFactory2",
                            "partnerCandidate", "MANY_TO_ONE", "Check Evaluations", "IconChecklist"),
                RelationDef("trackCheck", "Track Check", "IconChecklist",
                            "trackCheck", "MANY_TO_ONE", "Evaluations", "IconChecklist"),
            ],
        ),
        ObjectDef(
            "enrichmentEvaluation", "enrichmentEvaluations",
            "Enrichment Evaluation", "Enrichment Evaluations",
            "Per-enrichment extracted value for a candidate",
            "IconTablePlus",
            fields=[
                FieldDef("TEXT", "valueText", "Value", "IconTextCaption"),
                FieldDef("TEXT", "reasoningMd", "Reasoning Markdown", "IconFileDescription"),
                FieldDef("RAW_JSON", "sources", "Sources", "IconLink"),
            ],
            relations=[
                RelationDef("partnerCandidate", "Partner Candidate", "IconBuildingFactory2",
                            "partnerCandidate", "MANY_TO_ONE", "Enrichment Evaluations", "IconTablePlus"),
                RelationDef("trackEnrichment", "Track Enrichment", "IconTablePlus",
                            "trackEnrichment", "MANY_TO_ONE", "Evaluations", "IconTablePlus"),
            ],
        ),
    ],
)


# ---------------------------------------------------------------------------
# All modules and convenience accessors
# ---------------------------------------------------------------------------

ALL_MODULES = [CORE_MODULE, COSELL_MODULE, DISCOVERY_MODULE]

MODULE_MAP = {m.name: m for m in ALL_MODULES}

# Objects that MUST exist before relations can target them
# (topological ordering within each module)
OBJECT_CREATION_ORDER = [
    # Core first (many things point to partnerProfile)
    "partnerProfile",
    "partnerContactAssignment",
    "lead",
    # Cosell (partnerCustomerMap before customerEvent/customerSnapshot)
    "partnerCustomerMap",
    "partnerAttributionEvent",
    "partnerAttributionSnapshot",
    "customerEvent",
    "customerSnapshot",
    # Discovery (partnerTrack first, then children)
    "partnerTrack",
    "trackCheck",
    "trackEnrichment",
    "trackExclusion",
    "discoveryRun",
    "partnerCandidate",
    "checkEvaluation",
    "enrichmentEvaluation",
]
