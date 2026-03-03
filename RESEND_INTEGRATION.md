# Resend OpenTelemetry Integration Setup

This document explains how to configure and use the Resend email service with OpenTelemetry tracing in Twenty.

## Overview

The Resend integration adds OpenTelemetry tracing support for all email sending operations through Resend's API. This allows you to:

- Monitor email delivery in real-time
- Trace email operations across your distributed system
- Capture email metadata (recipients, subject, sender)
- Detect and troubleshoot email delivery issues

## Installation

The integration requires three packages:

1. **resend** - Resend Node.js SDK
2. **@kubiks/otel-resend** - OpenTelemetry instrumentation for Resend
3. **@opentelemetry/api** - OpenTelemetry core API (already included in Twenty)

Dependencies have been added to `packages/twenty-server/package.json`:
- `"resend": "^3.0.0"`
- `"@kubiks/otel-resend": "^1.1.0"`

## Configuration

### Environment Variables

Set the following environment variables to enable Resend:

```env
# Email driver selection
EMAIL_DRIVER=RESEND

# Resend API key (get from https://resend.com/keys)
RESEND_API_KEY=re_your_api_key_here
```

### Files Changed

1. **packages/twenty-server/src/engine/core-modules/email/enums/email-driver.enum.ts**
   - Added `RESEND = 'RESEND'` to the EmailDriver enum

2. **packages/twenty-server/src/engine/core-modules/email/drivers/resend.driver.ts** (NEW)
   - Implements the Resend email driver
   - Wraps Resend client with OpenTelemetry instrumentation
   - Converts nodemailer SendMailOptions to Resend format

3. **packages/twenty-server/src/engine/core-modules/email/email-driver.factory.ts**
   - Added import for ResendDriver
   - Added RESEND case to buildConfigKey() method
   - Added RESEND case to createDriver() method

## Usage

Once configured with `EMAIL_DRIVER=RESEND` and `RESEND_API_KEY`, all email sending operations will automatically:

1. Be traced with OpenTelemetry spans
2. Include metadata about recipients, subject, and sender
3. Capture delivery status

### Example Request Flow

When sending an email:

```typescript
// This code doesn't change - it works with any driver
await emailService.send({
  from: 'hello@example.com',
  to: 'user@example.com',
  subject: 'Welcome to Twenty',
  html: '<p>Hello world</p>',
});
```

The Resend driver will automatically:
1. Instrument the Resend client with OpenTelemetry
2. Create a trace span with email metadata
3. Send the email through Resend's API
4. Log the operation result

## OpenTelemetry Span Attributes

Each email send operation creates a span with the following attributes:

| Attribute | Description | Example |
|-----------|-------------|---------|
| `messaging.system` | Service name | `resend` |
| `messaging.operation` | Operation type | `send` |
| `resend.resource` | Resource type | `emails` |
| `resend.target` | Full target | `emails.send` |
| `resend.to_addresses` | Recipients | `user@example.com, another@example.com` |
| `resend.from` | Sender | `hello@example.com` |
| `resend.subject` | Email subject | `Welcome to Twenty` |
| `resend.recipient_count` | Number of recipients | `1` |
| `resend.message_id` | Resend message ID | `email_123abc` |

## Getting a Resend API Key

1. Visit https://resend.com
2. Sign up for a free account
3. Navigate to API Keys in your dashboard
4. Create a new API key
5. Copy the key and set it as `RESEND_API_KEY` environment variable

## Testing

To test the integration:

1. Set `EMAIL_DRIVER=RESEND` and `RESEND_API_KEY=your_key`
2. Verify the sender email is verified in Resend (required for production)
3. Trigger an email operation (signup, password reset, etc.)
4. Check Resend dashboard for delivery status
5. Verify traces appear in your OpenTelemetry observability platform (Kubiks)

## Troubleshooting

### "RESEND driver requires RESEND_API_KEY to be defined"
- Ensure `RESEND_API_KEY` environment variable is set correctly
- Check that the API key is valid in your Resend dashboard

### Email not sending
- Verify sender email is added to approved senders in Resend dashboard
- For production, the sender email must be verified
- Check Resend dashboard for delivery logs

### Missing traces
- Ensure OpenTelemetry instrumentation is enabled
- Verify trace collector/exporter is configured
- Check that email operations are actually being executed

## References

- [Resend Documentation](https://resend.com/docs)
- [Kubiks OpenTelemetry Resend Integration](https://github.com/kubiks-inc/otel)
- [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/)
