# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.21.1
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install pnpm
ARG PNPM_VERSION=latest
RUN npm install -g pnpm@$PNPM_VERSION


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# Copy application code
COPY . .

# Build application
RUN pnpm run build

# Remove development dependencies
RUN pnpm prune --prod


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "pnpm", "run", "start" ]
 > [build 3/6] RUN pnpm install --frozen-lockfile --prod=false:
1.027 [ERR_PNPM_LOCKFILE_CONFIG_MISMATCH] Cannot proceed with the frozen installation. The current "settings.autoInstallPeers" configuration doesn't match the value found in the lockfile
1.027 
1.027 Update your lockfile using "pnpm install --no-frozen-lockfile"
------
==> Building image
Waiting for depot builder...

==> Building image with Depot
--> build:  (​)
#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile: 1.07kB 0.1s done
#1 DONE 0.1s

#2 resolve image config for docker-image://docker.io/docker/dockerfile:1
#2 DONE 0.3s

#3 docker-image://docker.io/docker/dockerfile:1@sha256:2780b5c3bab67f1f76c781860de469442999ed1a0d7992a5efdf2cffc0e3d769
#3 resolve docker.io/docker/dockerfile:1@sha256:2780b5c3bab67f1f76c781860de469442999ed1a0d7992a5efdf2cffc0e3d769 done
#3 CACHED

#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile: 1.07kB 0.1s done
#1 DONE 0.1s

#4 [internal] load build definition from Dockerfile
#4 Deduplicating step ID [internal] load build definition from Dockerfile, another build is calculating it done
#4 DONE 0.0s

#5 [internal] load metadata for docker.io/library/node:22.21.1-slim
#5 DONE 0.3s

#6 [internal] load .dockerignore
#6 transferring context: 99B 0.1s done
#6 DONE 0.1s

#7 [base 1/3] FROM docker.io/library/node:22.21.1-slim@sha256:25b3eb23a00590b7499f2a2ce939322727fcce1b15fdd69754fcd09536a3ae2c
#7 resolve docker.io/library/node:22.21.1-slim@sha256:25b3eb23a00590b7499f2a2ce939322727fcce1b15fdd69754fcd09536a3ae2c done
#7 DONE 0.0s

#8 [base 2/3] WORKDIR /app
#8 CACHED

#9 [base 3/3] RUN npm install -g pnpm@latest
#9 CACHED

#10 [internal] load build context
#10 transferring context: 3.12kB 0.1s done
#10 DONE 0.1s

#11 [build 1/6] RUN apt-get update -qq &&     apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3
#11 CACHED

#12 [build 2/6] COPY package.json pnpm-lock.yaml ./
#12 CACHED

#13 [build 3/6] RUN pnpm install --frozen-lockfile --prod=false
#13 0.928 [ERR_PNPM_LOCKFILE_CONFIG_MISMATCH] Cannot proceed with the frozen installation. The current "settings.autoInstallPeers" configuration doesn't match the value found in the lockfile
#13 0.928 
#13 0.928 Update your lockfile using "pnpm install --no-frozen-lockfile"
#13 ERROR: process "/bin/sh -c pnpm install --frozen-lockfile --prod=false" did not complete successfully: exit code: 1
------
 > [build 3/6] RUN pnpm install --frozen-lockfile --prod=false:
0.928 [ERR_PNPM_LOCKFILE_CONFIG_MISMATCH] Cannot proceed with the frozen installation. The current "settings.autoInstallPeers" configuration doesn't match the value found in the lockfile
0.928 
0.928 Update your lockfile using "pnpm install --no-frozen-lockfile"
------
Error: failed to fetch an image or build from source: error building: failed to solve: process "/bin/sh -c pnpm install --frozen-lockfile --prod=false" did not complete successfully: exit code: 1
Dockerfile failed to build error
unsuccessful command 'flyctl deploy --build-only --push -a sofine --image-label deployment-7620c591bfa2b3e87f50691af2b0aa8d '
```

Dockerfile


```
# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.21.1
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install pnpm
ARG PNPM_VERSION=latest
RUN npm install -g pnpm@$PNPM_VERSION


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# Copy application code
COPY . .

# Build application
RUN pnpm run build

# Remove development dependencies
RUN pnpm prune --prod


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "pnpm", "run", "start" ]

```


.dockerignore


```
/.git
/node_modules
.dockerignore
.env
Dockerfile
fly.toml

```


fly.toml


```
# fly.toml app configuration file generated for sofine on 2026-05-10T20:37:24Z
#
# See https://fly.io/docs/reference/configuration/ for information about how to use this file.
#

app = 'sofine'
primary_region = 'cdg'

[build]

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = 'stop'
  auto_start_machines = true
  min_machines_running = 0
  processes = ['app']

[[vm]]
  memory = '1gb'
  cpu_kind = 'shared'
  cpus = 1
  memory_mb = 1024

```

