import { API_GRAPHQL_URL } from "../config/env.config";

import type { CodegenConfig } from "@graphql-codegen/cli";
import type { Types } from "@graphql-codegen/plugin-helpers";

type GraphQLCodegenConfig = Types.ConfiguredOutput;

/**
 * Shared plugins across the generated GraphQL Codegen artifacts.
 */
const sharedPlugins: GraphQLCodegenConfig["plugins"] = [
  "typescript",
  "typescript-operations",
  {
    add: {
      // Prepend artifact with TS no-check directive
      content: "// @ts-nocheck",
    },
  },
];

/**
 * Shared configuration across each of the generated GraphQL Codegen artifacts.
 */
const sharedConfig: GraphQLCodegenConfig["config"] = {
  scalars: {
    Date: { input: "Date", output: "string" },
    Datetime: { input: "Date", output: "string" },
    UUID: "string",
    Cursor: "string",
    BigInt: "string",
  },
  defaultScalarType: "unknown",
  constEnum: true,
};

/**
 * GraphQL Code Generator configuration.
 */
const graphqlCodegenConfig: CodegenConfig = {
  schema: API_GRAPHQL_URL,
  documents: "src/lib/graphql/**/*.graphql",
  ignoreNoDocuments: true,
  config: {
    sort: true,
  },
  generates: {
    // TypeScript SDK
    "src/generated/graphql.sdk.ts": {
      plugins: [...sharedPlugins, "typescript-graphql-request"],
      config: sharedConfig,
    },
    // React Query hooks, types, and utilities
    "src/generated/graphql.ts": {
      plugins: [...sharedPlugins, "typescript-react-query"],
      config: {
        ...sharedConfig,
        reactQueryVersion: 5,
        addInfiniteQuery: true,
        addSuspenseQuery: true,
        exposeQueryKeys: true,
        exposeMutationKeys: true,
        exposeFetcher: true,
        fetcher: {
          func: "@/lib/graphql/graphqlFetch#graphqlFetch",
        },
      },
    },
  },
};

export default graphqlCodegenConfig;
