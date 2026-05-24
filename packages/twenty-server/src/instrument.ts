import process from 'process';

import opentelemetry from '@opentelemetry/api';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import {
  AggregationTemporality,
  ConsoleMetricExporter,
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import { NodeEnvironment } from 'src/engine/core-modules/twenty-config/interfaces/node-environment.interface';

import { ExceptionHandlerDriver } from 'src/engine/core-modules/exception-handler/interfaces';
import { MeterDriver } from 'src/engine/core-modules/metrics/types/meter-driver.type';
import { parseArrayEnvVar } from 'src/utils/parse-array-env-var';

const meterDrivers = parseArrayEnvVar(
  process.env.METER_DRIVER,
  Object.values(MeterDriver),
  [],
);

// Trace setup with OpenTelemetry
if (process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
  const traceExporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT + '/v1/traces',
    headers: process.env.OTEL_EXPORTER_OTLP_HEADERS
      ? Object.fromEntries(
          process.env.OTEL_EXPORTER_OTLP_HEADERS.split(',').map((header) => {
            const [key, value] = header.split('=');
            return [key.trim(), value.trim()];
          }),
        )
      : {},
  });

  const sdk = new NodeSDK({
    traceExporter,
    serviceName: process.env.OTEL_SERVICE_NAME || 'twenty-server',
  });

  sdk.start();

  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((log) => console.log('Failed to terminate tracing', log))
      .finally(() => process.exit(0));
  });
}

if (process.env.EXCEPTION_HANDLER_DRIVER === ExceptionHandlerDriver.SENTRY) {
  Sentry.init({
    environment: process.env.SENTRY_ENVIRONMENT,
    release: process.env.APP_VERSION,
    dsn: process.env.SENTRY_DSN,
    integrations: [
      Sentry.redisIntegration(),
      Sentry.httpIntegration(),
      Sentry.expressIntegration(),
      Sentry.graphqlIntegration(),
      Sentry.postgresIntegration(),
      Sentry.vercelAIIntegration({
        recordInputs: true,
        recordOutputs: true,
      }),
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.3,
    sendDefaultPii: true,
    debug: process.env.NODE_ENV === NodeEnvironment.DEVELOPMENT,
  });
}

// Meter setup

const prometheusExporter = meterDrivers.includes(MeterDriver.Prometheus)
  ? new PrometheusExporter({ port: 9464 })
  : null;

const meterProvider = new MeterProvider({
  readers: [
    ...(meterDrivers.includes(MeterDriver.Console)
      ? [
          new PeriodicExportingMetricReader({
            exporter: new ConsoleMetricExporter(),
            exportIntervalMillis: 10000,
          }),
        ]
      : []),
    ...(meterDrivers.includes(MeterDriver.OpenTelemetry)
      ? [
          new PeriodicExportingMetricReader({
            exporter: new OTLPMetricExporter({
              url: process.env.OTLP_COLLECTOR_METRICS_ENDPOINT_URL,
              temporalityPreference: AggregationTemporality.DELTA,
            }),
            exportIntervalMillis: 10000,
          }),
        ]
      : []),
    ...(prometheusExporter ? [prometheusExporter] : []),
  ],
});

opentelemetry.metrics.setGlobalMeterProvider(meterProvider);
