# 🌋 Mantle

Mantle is Omni's business operations suite: people, invoices, quotes and contracts, and inventory in one workspace. This metarepo orchestrates the Mantle services for local development and self-hosting.

Product documentation lives at [docs.omni.dev](https://docs.omni.dev/products/mantle).

Services:

- [`mantle-api`](https://github.com/omnidotdev/mantle-api): the GraphQL API, built with [Elysia](https://elysiajs.com) and [PostGraphile](https://postgraphile.org)
- [`mantle-app`](https://github.com/omnidotdev/mantle-app): the web app, built with [TanStack Start](https://tanstack.com/start)

## Self-Hosting

The quickest path is [Run](https://docs.omni.dev/products/run), which generates secrets and prompts for your sign-in provider:

```sh
omni run up mantle
```

To run the stack with Docker Compose instead, you need [Docker](https://docs.docker.com/get-docker) and an OpenID Connect provider to sign in with. Register Mantle with the provider as a confidential client whose redirect URI is `<APP_URL>/api/auth/callback/omni`, then:

```sh
cp .env.local.template .env.local   # fill in the required values
docker compose --env-file .env.local up -d
```

The app serves at `http://localhost:3000` and the API at `http://localhost:4000`. Data lives in the `db_data` volume.

## Local Development

### Prerequisites

- [Tilt](https://tilt.dev)
- [Bun](https://bun.sh)
- [PostgreSQL](https://www.postgresql.org) (or [Docker](https://www.docker.com) to run it in a container)
- [mkcert](https://github.com/FiloSottile/mkcert), for the local TLS certificates both services serve over HTTPS

### Getting Started

1. Copy the template configuration:

```sh
cp services.yaml.template services.yaml
```

2. Configure the services as needed. To disable a service, comment it out. Any included services will be locally cloned.

3. Set up each service (environment variables, a database for `mantle-api`, TLS certificates) as described in its README.

4. Start the development environment:

```sh
tilt up
```

The `Tiltfile` will automatically pull in resources from any nested `Tiltfile`s it discovers. A [Weaver](https://github.com/omnidotdev/weaver-cli) workspace (`weaver.yaml`) also declares the repositories, including the platform stacks Mantle depends on (HIDRA, Aether, Vortex).

### Configuration

Each service in `services.yaml` can specify:

| Key | Description |
|-----|-------------|
| `repo` | Git repository URL for cloning |
| `path` | Local path override (defaults to `services/service-name`) |
| `metarepo` | Load every `services/*/Tiltfile` under `path` (for platform stacks) |
| `env` | Environment variables to set before the service's `Tiltfile` loads |

> 💡 If nested repos are cloned within this metarepo and you open it in your IDE, directories may be marked as ignored due to `.gitignore` patterns. To work around this, open services in their own directory (e.g., a separate VS Code workspace unit).

> ⚠️ Services might have their own setup requirements, such as environment variable configuration. Consult each service's README to ensure all initial requirements are satisfied.

To build the Compose stack from local source instead of pulling images, layer the dev override (requires the services to be cloned):

```sh
docker compose --env-file .env.local -f compose.yaml -f compose.dev.yaml up --build
```

## Diagnostics

```sh
docker compose ps                 # health of each service
docker compose logs -f api app    # boot and request logs
curl http://localhost:4000/ready  # API and database readiness
```

- Optional integrations that are not configured log `<VAR> not set, <feature> disabled` on boot; that is expected when self-hosting
- Signed in but no workspace: set `PERSONAL_WORKSPACE_FALLBACK=true` (the default in `compose.yaml`) unless your provider is Omni Gatekeeper
- Signed in but data does not load: check that `AUTH_JWKS_URL` belongs to the same provider as `AUTH_BASE_URL`

## License

The code in this repository is licensed under Apache 2.0, &copy; [Omni LLC](https://omni.dev). See [LICENSE.md](LICENSE.md) for more information.
